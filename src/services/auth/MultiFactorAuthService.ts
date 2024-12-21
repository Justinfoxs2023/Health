import { BiometricAuthService } from './BiometricAuthService';
import { CacheManager } from '../cache/CacheManager';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { NotificationService } from '../notification/NotificationService';
import { SecurityAuditor } from '../security/SecurityAuditor';
import { injectable, inject } from 'inversify';

export type AuthFactorType =
  any;

export interface IAuthFactor {
  /** type 的描述 */
  type: "password" | "biometric" | "otp" | "email" | "sms" | "security_questions";
  /** isEnabled 的描述 */
  isEnabled: false | true;
  /** lastVerified 的描述 */
  lastVerified: number;
  /** metadata 的描述 */
  metadata: Recordstring /** any 的描述 */;
  /** any 的描述 */
  any;
}

export interface IMFAConfiguration {
  /** userId 的描述 */
  userId: string;
  /** requiredFactors 的描述 */
  requiredFactors: number;
  /** enabledFactors 的描述 */
  enabledFactors: IAuthFactor;
  /** backupCodes 的描述 */
  backupCodes: string;
  /** createdAt 的描述 */
  createdAt: number;
  /** updatedAt 的描述 */
  updatedAt: number;
}

export interface IVerificationRequest {
  /** userId 的描述 */
  userId: string;
  /** factorType 的描述 */
  factorType: "password" | "biometric" | "otp" | "email" | "sms" | "security_questions";
  /** verificationData 的描述 */
  verificationData: any;
}

export interface IVerificationResult {
  /** success 的描述 */
  success: false | true;
  /** factorType 的描述 */
  factorType: "password" | "biometric" | "otp" | "email" | "sms" | "security_questions";
  /** error 的描述 */
  error: string;
  /** timestamp 的描述 */
  timestamp: number;
}

@injectable()
export class MultiFactorAuthService {
  private readonly otpValidityPeriod = 300000; // 5分钟
  private readonly maxFailedAttempts = 3;
  private readonly lockoutDuration = 900000; // 15分钟
  private readonly backupCodesCount = 10;

  constructor(
    @inject() private logger: Logger,
    @inject() private databaseService: DatabaseService,
    @inject() private cacheManager: CacheManager,
    @inject() private eventBus: EventBus,
    @inject() private securityAuditor: SecurityAuditor,
    @inject() private notificationService: NotificationService,
    @inject() private biometricAuthService: BiometricAuthService,
  ) {}

  /**
   * 配置多因素认证
   */
  public async configureMFA(
    userId: string,
    config: Partial<IMFAConfiguration>,
  ): Promise<IMFAConfiguration> {
    try {
      const existingConfig = await this.getMFAConfiguration(userId);

      const newConfig: IMFAConfiguration = {
        userId,
        requiredFactors: config.requiredFactors || existingConfig?.requiredFactors || 2,
        enabledFactors: config.enabledFactors || existingConfig?.enabledFactors || [],
        backupCodes:
          config.backupCodes || existingConfig?.backupCodes || this.generateBackupCodes(),
        createdAt: existingConfig?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      await this.databaseService.upsert('mfa_configurations', { userId }, newConfig);

      // 更新缓存
      await this.cacheManager.set(
        `mfa:config:${userId}`,
        newConfig,
        3600000, // 1小时
      );

      // 记录审计日志
      await this.securityAuditor.logEvent({
        type: 'mfa.config.updated',
        userId,
        details: {
          requiredFactors: newConfig.requiredFactors,
          enabledFactors: newConfig.enabledFactors.map(f => f.type),
        },
      });

      // 发送通知
      await this.notificationService.send({
        type: 'security_update',
        recipients: [userId],
        subject: '多因素认证配置更新',
        content: '您的账号安全设置已更新，如非本人操作请立即联系客服。',
      });

      return newConfig;
    } catch (error) {
      this.logger.error('配置多因素认证失败', error);
      throw error;
    }
  }

  /**
   * 验证认证因素
   */
  public async verifyFactor(request: IVerificationRequest): Promise<IVerificationResult> {
    try {
      // 检查是否被锁定
      if (await this.isUserLocked(request.userId)) {
        return {
          success: false,
          factorType: request.factorType,
          error: '账号已被锁定，请稍后重试',
          timestamp: Date.now(),
        };
      }

      // 验证具体因素
      const result = await this.verifySpecificFactor(request);

      if (!result.success) {
        await this.handleFailedAttempt(request.userId);
      } else {
        await this.updateFactorVerification(request.userId, request.factorType);
      }

      // 记录审计日志
      await this.securityAuditor.logEvent({
        type: 'mfa.factor.verified',
        userId: request.userId,
        details: {
          factorType: request.factorType,
          success: result.success,
          timestamp: Date.now(),
        },
      });

      return result;
    } catch (error) {
      this.logger.error('验证认证因素失败', error);
      throw error;
    }
  }

  /**
   * 检查认证状态
   */
  public async checkAuthStatus(userId: string): Promise<{
    isComplete: boolean;
    verifiedFactors: AuthFactorType[];
    remainingFactors: AuthFactorType[];
  }> {
    try {
      const config = await this.getMFAConfiguration(userId);
      if (!config) {
        throw new Error('未找到多因素认证配置');
      }

      const verifiedFactors = config.enabledFactors
        .filter(
          f => f.lastVerified && Date.now() - f.lastVerified < 3600000, // 1小时内验证过
        )
        .map(f => f.type);

      const remainingFactors = config.enabledFactors
        .filter(f => !verifiedFactors.includes(f.type))
        .map(f => f.type);

      return {
        isComplete: verifiedFactors.length >= config.requiredFactors,
        verifiedFactors,
        remainingFactors,
      };
    } catch (error) {
      this.logger.error('检查认证状态失败', error);
      throw error;
    }
  }

  /**
   * 重置多因素认证
   */
  public async resetMFA(userId: string): Promise<void> {
    try {
      await this.databaseService.delete('mfa_configurations', { userId });
      await this.cacheManager.delete(`mfa:config:${userId}`);

      // 记录审计日志
      await this.securityAuditor.logEvent({
        type: 'mfa.config.reset',
        userId,
        details: {
          timestamp: Date.now(),
        },
      });

      // 发送通知
      await this.notificationService.send({
        type: 'security_alert',
        recipients: [userId],
        subject: '多因素认证已重置',
        content: '您的多因素认证设置已被重置，如非本人操作请立即联系客服。',
      });
    } catch (error) {
      this.logger.error('重置多因素认证失败', error);
      throw error;
    }
  }

  /**
   * 获取MFA配���
   */
  private async getMFAConfiguration(userId: string): Promise<IMFAConfiguration | null> {
    try {
      // 尝试从缓存获取
      let config = await this.cacheManager.get<IMFAConfiguration>(`mfa:config:${userId}`);

      if (!config) {
        // 从数据库获取
        config = await this.databaseService.findOne('mfa_configurations', { userId });

        if (config) {
          // 更新缓存
          await this.cacheManager.set(`mfa:config:${userId}`, config, 3600000);
        }
      }

      return config;
    } catch (error) {
      this.logger.error('获取MFA配置失败', error);
      throw error;
    }
  }

  /**
   * 验证具体认证因素
   */
  private async verifySpecificFactor(request: IVerificationRequest): Promise<IVerificationResult> {
    switch (request.factorType) {
      case 'biometric':
        const biometricResult = await this.biometricAuthService.verifyBiometric(
          request.verificationData,
        );
        return {
          success: biometricResult.success,
          factorType: 'biometric',
          error: biometricResult.error,
          timestamp: Date.now(),
        };

      case 'otp':
        return await this.verifyOTP(request);

      case 'email':
        return await this.verifyEmailCode(request);

      case 'sms':
        return await this.verifySMSCode(request);

      case 'security_questions':
        return await this.verifySecurityQuestions(request);

      default:
        return {
          success: false,
          factorType: request.factorType,
          error: '不支持的认证因素类型',
          timestamp: Date.now(),
        };
    }
  }

  /**
   * 验证OTP
   */
  private async verifyOTP(request: IVerificationRequest): Promise<IVerificationResult> {
    try {
      const storedOTP = await this.cacheManager.get<string>(`mfa:otp:${request.userId}`);
      const isValid = storedOTP === request.verificationData.code;

      if (isValid) {
        await this.cacheManager.delete(`mfa:otp:${request.userId}`);
      }

      return {
        success: isValid,
        factorType: 'otp',
        error: isValid ? undefined : 'OTP验证码无效或已过期',
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error('验证OTP失败', error);
      throw error;
    }
  }

  /**
   * 验证邮件验证码
   */
  private async verifyEmailCode(request: IVerificationRequest): Promise<IVerificationResult> {
    try {
      const storedCode = await this.cacheManager.get<string>(`mfa:email:${request.userId}`);
      const isValid = storedCode === request.verificationData.code;

      if (isValid) {
        await this.cacheManager.delete(`mfa:email:${request.userId}`);
      }

      return {
        success: isValid,
        factorType: 'email',
        error: isValid ? undefined : '邮件验证码无效或已过期',
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error('验证邮件验证码失败', error);
      throw error;
    }
  }

  /**
   * 验证短信验证码
   */
  private async verifySMSCode(request: IVerificationRequest): Promise<IVerificationResult> {
    try {
      const storedCode = await this.cacheManager.get<string>(`mfa:sms:${request.userId}`);
      const isValid = storedCode === request.verificationData.code;

      if (isValid) {
        await this.cacheManager.delete(`mfa:sms:${request.userId}`);
      }

      return {
        success: isValid,
        factorType: 'sms',
        error: isValid ? undefined : '短信验证码无效或已过期',
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error('验证短信验证码失败', error);
      throw error;
    }
  }

  /**
   * 验证安全问题
   */
  private async verifySecurityQuestions(
    request: IVerificationRequest,
  ): Promise<IVerificationResult> {
    try {
      const userQuestions = await this.databaseService.findOne('security_questions', {
        userId: request.userId,
      });

      if (!userQuestions) {
        return {
          success: false,
          factorType: 'security_questions',
          error: '未设置安全问题',
          timestamp: Date.now(),
        };
      }

      const answers = request.verificationData.answers;
      const isValid = userQuestions.answers.every(
        (stored: string, index: number) => stored === answers[index],
      );

      return {
        success: isValid,
        factorType: 'security_questions',
        error: isValid ? undefined : '安全问题答案错误',
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error('验证安全问题失败', error);
      throw error;
    }
  }

  /**
   * 处理失败尝试
   */
  private async handleFailedAttempt(userId: string): Promise<void> {
    try {
      const cacheKey = `mfa:failed:${userId}`;
      const failedAttempts = ((await this.cacheManager.get<number>(cacheKey)) || 0) + 1;

      if (failedAttempts >= this.maxFailedAttempts) {
        // 锁定用户
        await this.lockUser(userId);

        // 记录审计日志
        await this.securityAuditor.logEvent({
          type: 'mfa.user.locked',
          userId,
          details: {
            failedAttempts,
            lockoutDuration: this.lockoutDuration,
          },
        });

        // 发送通知
        await this.notificationService.send({
          type: 'security_alert',
          recipients: [userId],
          subject: '账号安全警告',
          content: '由于多次验证失败，您的账号已被临时锁定。如非本人操作，请立即联系客服。',
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
   * 锁定���户
   */
  private async lockUser(userId: string): Promise<void> {
    try {
      const lockKey = `mfa:lock:${userId}`;
      await this.cacheManager.set(lockKey, true, this.lockoutDuration);

      this.logger.warn('用户已被锁定', {
        userId,
        duration: this.lockoutDuration,
      });
    } catch (error) {
      this.logger.error('锁定用户失败', error);
      throw error;
    }
  }

  /**
   * 检查用户是否被锁定
   */
  private async isUserLocked(userId: string): Promise<boolean> {
    try {
      const lockKey = `mfa:lock:${userId}`;
      return (await this.cacheManager.get<boolean>(lockKey)) || false;
    } catch (error) {
      this.logger.error('检查用户锁定状态失败', error);
      throw error;
    }
  }

  /**
   * 更新因素验证时间
   */
  private async updateFactorVerification(
    userId: string,
    factorType: AuthFactorType,
  ): Promise<void> {
    try {
      const config = await this.getMFAConfiguration(userId);
      if (!config) return;

      const factor = config.enabledFactors.find(f => f.type === factorType);
      if (factor) {
        factor.lastVerified = Date.now();
        await this.configureMFA(userId, config);
      }
    } catch (error) {
      this.logger.error('更新因素验证时间失败', error);
      throw error;
    }
  }

  /**
   * 生成备份码
   */
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < this.backupCodesCount; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    return codes;
  }
}
