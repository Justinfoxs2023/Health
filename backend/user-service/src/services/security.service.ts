import { Logger } from '../utils/logger';
import { Redis } from '../utils/redis';
import { SecurityError } from '../utils/errors';
import { config } from '../config';

export class SecurityService {
  private redis: Redis;
  private logger: Logger;

  constructor() {
    this.redis = new Redis();
    this.logger = new Logger('SecurityService');
  }

  /**
   * 检查登录尝试次数
   */
  public async checkLoginAttempts(userId: string): Promise<void> {
    try {
      const key = `login_attempts:${userId}`;
      const attempts = await this.redis.get(key);

      if (attempts && parseInt(attempts) >= config.security.maxLoginAttempts) {
        // 锁定账户
        await this.lockAccount(userId);
        throw new SecurityError('账户已被锁定，请稍后再试');
      }
    } catch (error) {
      this.logger.error('检查登录尝试失败', error);
      throw error;
    }
  }

  /**
   * 记录登录尝试
   */
  public async recordLoginAttempt(userId: string, success: boolean): Promise<void> {
    try {
      const key = `login_attempts:${userId}`;

      if (success) {
        // 登录成功，清除尝试记录
        await this.redis.del(key);
      } else {
        // 登录失败，增加尝试次数
        await this.redis.incr(key);
        await this.redis.expire(key, config.security.loginAttemptsTTL);
      }
    } catch (error) {
      this.logger.error('记录登录尝试失败', error);
      throw error;
    }
  }

  /**
   * 锁定账户
   */
  private async lockAccount(userId: string): Promise<void> {
    try {
      // 更新用户状态为锁定
      await this.userService.updateUser(userId, { status: 'locked' });

      // 设置锁定时间
      const key = `account_locked:${userId}`;
      await this.redis.setex(key, config.security.accountLockDuration, '1');
    } catch (error) {
      this.logger.error('锁定账户失败', error);
      throw error;
    }
  }

  /**
   * 检查IP限制
   */
  public async checkIPLimit(ip: string): Promise<void> {
    try {
      const key = `ip_requests:${ip}`;
      const requests = await this.redis.get(key);

      if (requests && parseInt(requests) >= config.security.maxIPRequests) {
        throw new SecurityError('请求频率过高，请稍后再试');
      }

      await this.redis.incr(key);
      await this.redis.expire(key, config.security.ipLimitTTL);
    } catch (error) {
      this.logger.error('检查IP限制失败', error);
      throw error;
    }
  }

  /**
   * 验证设备指纹
   */
  public async validateDeviceFingerprint(userId: string, fingerprint: string): Promise<boolean> {
    try {
      const key = `device_fingerprint:${userId}`;
      const knownFingerprints = await this.redis.smembers(key);

      if (!knownFingerprints.includes(fingerprint)) {
        // 记录新设备登录
        await this.redis.sadd(key, fingerprint);
        // 发送新设备登录通知
        await this.notificationService.sendNewDeviceAlert(userId, fingerprint);
      }

      return true;
    } catch (error) {
      this.logger.error('验证设备指纹失败', error);
      throw error;
    }
  }
}
