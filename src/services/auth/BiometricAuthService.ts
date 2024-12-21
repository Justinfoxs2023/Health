import { CacheManager } from '../cache/CacheManager';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { SecurityAuditor } from '../security/SecurityAuditor';
import { injectable, inject } from 'inversify';

export interface IBiometricCredential {
  /** userId 的描述 */
    userId: string;
  /** type 的描述 */
    type: fingerprint  face  iris;
  data: string;
  deviceId: string;
  createdAt: number;
  lastUsedAt: number;
  status: active  disabled;
}

export interface IBiometricAuthResult {
  /** success 的描述 */
    success: false | true;
  /** userId 的描述 */
    userId: string;
  /** error 的描述 */
    error: string;
  /** timestamp 的描述 */
    timestamp: number;
}

export interface IBiometricVerification {
  /** type 的描述 */
    type: fingerprint  face  iris;
  data: string;
  deviceId: string;
  timestamp: number;
}

@injectable()
export class BiometricAuthService {
  private readonly credentialCachePrefix = 'biometric:credential:';
  private readonly verificationTimeout = 30000; // 30秒
  private readonly maxFailedAttempts = 3;
  private readonly lockoutDuration = 300000; // 5分钟

  constructor(
    @inject() private logger: Logger,
    @inject() private databaseService: DatabaseService,
    @inject() private cacheManager: CacheManager,
    @inject() private eventBus: EventBus,
    @inject() private securityAuditor: SecurityAuditor,
  ) {}

  /**
   * 注册生物识别凭证
   */
  public async registerCredential(
    userId: string,
    credential: Omit<IBiometricCredential, 'userId' | 'createdAt' | 'lastUsedAt' | 'status'>,
  ): Promise<void> {
    try {
      // 验证用户是否已注册该类型的生物识别
      const existingCredential = await this.getCredential(userId, credential.type);
      if (existingCredential) {
        throw new Error(`用户已注册${credential.type}生物识别`);
      }

      // 创建新的生物识别凭证
      const newCredential: IBiometricCredential = {
        userId,
        ...credential,
        createdAt: Date.now(),
        lastUsedAt: Date.now(),
        status: 'active',
      };

      // 保存到数据库
      await this.databaseService.insert('biometric_credentials', newCredential);

      // 更新缓存
      await this.cacheManager.set(
        this.getCredentialCacheKey(userId, credential.type),
        newCredential,
      );

      // 记录安全审计
      await this.securityAuditor.logEvent({
        type: 'biometric.register',
        userId,
        details: {
          biometricType: credential.type,
          deviceId: credential.deviceId,
        },
      });

      // 发布事件
      this.eventBus.publish('biometric.credential.registered', {
        userId,
        type: credential.type,
        timestamp: Date.now(),
      });

      this.logger.info('注册生物识别凭证成功', {
        userId,
        type: credential.type,
      });
    } catch (error) {
      this.logger.error('注册生物识别凭证失败', error);
      throw error;
    }
  }

  /**
   * 验证生物识别
   */
  public async verifyBiometric(verification: IBiometricVerification): Promise<IBiometricAuthResult> {
    try {
      // 检查设备锁定状态
      if (await this.isDeviceLocked(verification.deviceId)) {
        return {
          success: false,
          error: '设备已锁定，请稍后重试',
          timestamp: Date.now(),
        };
      }

      // 查找匹配的凭证
      const credential = await this.findMatchingCredential(verification);
      if (!credential) {
        await this.handleFailedAttempt(verification.deviceId);
        return {
          success: false,
          error: '生物识别验证失败',
          timestamp: Date.now(),
        };
      }

      // 验证生物识别数据
      const isValid = await this.validateBiometricData(verification.data, credential.data);

      if (!isValid) {
        await this.handleFailedAttempt(verification.deviceId);
        return {
          success: false,
          error: '生物识别数据不匹配',
          timestamp: Date.now(),
        };
      }

      // 更新最后使用时间
      await this.updateCredentialUsage(credential);

      // 记录安全审计
      await this.securityAuditor.logEvent({
        type: 'biometric.verify.success',
        userId: credential.userId,
        details: {
          biometricType: verification.type,
          deviceId: verification.deviceId,
        },
      });

      // 发布事件
      this.eventBus.publish('biometric.auth.success', {
        userId: credential.userId,
        type: verification.type,
        timestamp: Date.now(),
      });

      return {
        success: true,
        userId: credential.userId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error('生物识别验证失败', error);
      return {
        success: false,
        error: '生物识别验证过程发生错误',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 禁用生物识别
   */
  public async disableCredential(userId: string, type: IBiometricCredential['type']): Promise<void> {
    try {
      const credential = await this.getCredential(userId, type);
      if (!credential) {
        throw new Error('生物识别凭证不存在');
      }

      // 更新状态
      credential.status = 'disabled';
      await this.databaseService.update(
        'biometric_credentials',
        { userId, type },
        { status: 'disabled' },
      );

      // 更新缓存
      await this.cacheManager.set(this.getCredentialCacheKey(userId, type), credential);

      // 记录安全审计
      await this.securityAuditor.logEvent({
        type: 'biometric.disable',
        userId,
        details: {
          biometricType: type,
        },
      });

      // 发布事件
      this.eventBus.publish('biometric.credential.disabled', {
        userId,
        type,
        timestamp: Date.now(),
      });

      this.logger.info('禁用生物识别凭证成功', {
        userId,
        type,
      });
    } catch (error) {
      this.logger.error('禁用生物识别凭证失败', error);
      throw error;
    }
  }

  /**
   * 获取用户的生物识别凭证
   */
  private async getCredential(
    userId: string,
    type: IBiometricCredential['type'],
  ): Promise<IBiometricCredential | null> {
    try {
      // ��试从缓存获取
      const cacheKey = this.getCredentialCacheKey(userId, type);
      let credential = await this.cacheManager.get<IBiometricCredential>(cacheKey);

      if (!credential) {
        // 从数据库获取
        credential = await this.databaseService.findOne('biometric_credentials', {
          userId,
          type,
          status: 'active',
        });

        if (credential) {
          // 更新缓存
          await this.cacheManager.set(cacheKey, credential);
        }
      }

      return credential;
    } catch (error) {
      this.logger.error('获取生物识别凭证失败', error);
      throw error;
    }
  }

  /**
   * 查找匹配的凭证
   */
  private async findMatchingCredential(
    verification: IBiometricVerification,
  ): Promise<IBiometricCredential | null> {
    try {
      return await this.databaseService.findOne('biometric_credentials', {
        type: verification.type,
        deviceId: verification.deviceId,
        status: 'active',
      });
    } catch (error) {
      this.logger.error('查找匹配凭证失败', error);
      throw error;
    }
  }

  /**
   * 验证生物识别数据
   */
  private async validateBiometricData(
    verificationData: string,
    storedData: string,
  ): Promise<boolean> {
    try {
      // 实现生物识别数据��对逻辑
      // 这里需要根据具体的生物识别技术实现
      return verificationData === storedData;
    } catch (error) {
      this.logger.error('验证生物识别数据失败', error);
      throw error;
    }
  }

  /**
   * 更新凭证使用记录
   */
  private async updateCredentialUsage(credential: IBiometricCredential): Promise<void> {
    try {
      credential.lastUsedAt = Date.now();
      await this.databaseService.update(
        'biometric_credentials',
        { userId: credential.userId, type: credential.type },
        { lastUsedAt: credential.lastUsedAt },
      );

      // 更新缓存
      await this.cacheManager.set(
        this.getCredentialCacheKey(credential.userId, credential.type),
        credential,
      );
    } catch (error) {
      this.logger.error('更新凭证使用记录失败', error);
      throw error;
    }
  }

  /**
   * 处理失败尝试
   */
  private async handleFailedAttempt(deviceId: string): Promise<void> {
    try {
      const cacheKey = `biometric:failed:${deviceId}`;
      const failedAttempts = ((await this.cacheManager.get<number>(cacheKey)) || 0) + 1;

      if (failedAttempts >= this.maxFailedAttempts) {
        // 锁定设备
        await this.lockDevice(deviceId);

        // 记录安全审计
        await this.securityAuditor.logEvent({
          type: 'biometric.device.locked',
          details: {
            deviceId,
            failedAttempts,
          },
        });
      } else {
        // 更新失败次数
        await this.cacheManager.set(cacheKey, failedAttempts, this.lockoutDuration);
      }
    } catch (error) {
      this.logger.error('处理失败尝试失败', error);
      throw error;
    }
  }

  /**
   * 锁定设备
   */
  private async lockDevice(deviceId: string): Promise<void> {
    try {
      const lockKey = `biometric:lock:${deviceId}`;
      await this.cacheManager.set(lockKey, true, this.lockoutDuration);

      this.logger.warn('设备已锁定', {
        deviceId,
        duration: this.lockoutDuration,
      });
    } catch (error) {
      this.logger.error('锁定设备失败', error);
      throw error;
    }
  }

  /**
   * 检查设备是否锁定
   */
  private async isDeviceLocked(deviceId: string): Promise<boolean> {
    try {
      const lockKey = `biometric:lock:${deviceId}`;
      return (await this.cacheManager.get<boolean>(lockKey)) || false;
    } catch (error) {
      this.logger.error('检查设备锁定状态失败', error);
      throw error;
    }
  }

  /**
   * 获取凭证缓存键
   */
  private getCredentialCacheKey(userId: string, type: IBiometricCredential['type']): string {
    return `${this.credentialCachePrefix}${userId}:${type}`;
  }
}
