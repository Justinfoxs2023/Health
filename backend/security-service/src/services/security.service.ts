import crypto from 'crypto';
import { AuditService } from './audit.service';
import { Logger } from '../utils/logger';
import { Redis } from '../utils/redis';

export class SecurityService {
  private redis: Redis;
  private logger: Logger;
  private auditService: AuditService;
  private readonly ENCRYPTION_KEY: string;
  private readonly IV_LENGTH = 16;

  constructor() {
    this.redis = new Redis();
    this.logger = new Logger('SecurityService');
    this.auditService = new AuditService();
    this.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
  }

  /**
   * 加密数据
   */
  async encryptData(data: any): Promise<string> {
    try {
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(this.ENCRYPTION_KEY, 'hex'),
        iv,
      );

      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag();

      return JSON.stringify({
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag.toString('hex'),
      });
    } catch (error) {
      this.logger.error('数据加密失败', error);
      throw error;
    }
  }

  /**
   * 解密数据
   */
  async decryptData(encryptedData: string): Promise<any> {
    try {
      const { iv, encryptedData: data, authTag } = JSON.parse(encryptedData);
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(this.ENCRYPTION_KEY, 'hex'),
        Buffer.from(iv, 'hex'),
      );

      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      let decrypted = decipher.update(data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      this.logger.error('数据解密失败', error);
      throw error;
    }
  }

  /**
   * 验证访问令牌
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // 检查令牌黑名单
      const isBlacklisted = await this.redis.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return false;
      }

      // 验证令牌签名和过期时间
      // 实现令牌验证逻辑

      return true;
    } catch (error) {
      this.logger.error('令牌验证失败', error);
      return false;
    }
  }

  /**
   * 检查权限
   */
  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    try {
      const permissions = await this.redis.get(`permissions:${userId}`);
      if (!permissions) {
        return false;
      }

      const userPermissions = JSON.parse(permissions);
      return userPermissions.some(
        (p: any) => p.resource === resource && p.actions.includes(action),
      );
    } catch (error) {
      this.logger.error('权限检查失败', error);
      return false;
    }
  }

  /**
   * 记录安全审计日志
   */
  async logSecurityAudit(data: {
    userId: string;
    action: string;
    resource: string;
    ip: string;
    userAgent: string;
    status: 'success' | 'failure';
    details?: any;
  }) {
    try {
      await this.auditService.logSecurityEvent({
        ...data,
        timestamp: new Date(),
        type: 'security_audit',
      });
    } catch (error) {
      this.logger.error('记录安全审计日志失败', error);
      throw error;
    }
  }

  /**
   * 检测异常行为
   */
  async detectAnomalies(userId: string, action: string): Promise<boolean> {
    try {
      const key = `user:actions:${userId}`;
      const actions = await this.redis.lrange(key, 0, -1);

      // 实现异常检测逻辑
      // 例如：检查操作频率、异常时间、异常位置等

      return false;
    } catch (error) {
      this.logger.error('异常检测失败', error);
      return false;
    }
  }
}
