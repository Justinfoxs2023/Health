import crypto from 'crypto';
import mongoose from 'mongoose';
import { logger } from '../logger';

class DatabaseSecurityService {
  /**
   * 初始化数据库安全配置
   */
  async initializeSecurity() {
    try {
      // 配置数据库角色和权限
      await this.configureRoles();

      // 配置数据库加密
      await this.configureEncryption();

      // 配置审计日志
      await this.configureAuditLogging();

      logger.info('数据库安全配置完成');
    } catch (error) {
      logger.error('数据库安全配置失败:', error);
      throw error;
    }
  }

  /**
   * 配置数据库角色和权限
   */
  private async configureRoles() {
    const db = mongoose.connection.db;

    try {
      // 创建只读角色
      await db.command({
        createRole: 'readOnlyRole',
        privileges: [
          {
            resource: { db: 'health_management', collection: '' },
            actions: ['find'],
          },
        ],
        roles: [],
      });

      // 创建读写角色
      await db.command({
        createRole: 'readWriteRole',
        privileges: [
          {
            resource: { db: 'health_management', collection: '' },
            actions: ['find', 'insert', 'update', 'remove'],
          },
        ],
        roles: [],
      });

      // 创建管理员���色
      await db.command({
        createRole: 'adminRole',
        privileges: [
          {
            resource: { db: 'health_management', collection: '' },
            actions: ['find', 'insert', 'update', 'remove', 'createIndex', 'dropIndex'],
          },
        ],
        roles: [],
      });
    } catch (error) {
      logger.error('角色配置失败:', error);
      throw error;
    }
  }

  /**
   * 配置数据库加密
   */
  private async configureEncryption() {
    try {
      // 检查是否启用了加密
      const adminDb = mongoose.connection.db.admin();
      const serverStatus = await adminDb.serverStatus();

      if (!serverStatus.security || !serverStatus.security.SSLServerHasCertificateAuthority) {
        logger.warn('数据库SSL/TLS未配置');
      }

      // 配置字段级加密
      await this.configureFieldLevelEncryption();
    } catch (error) {
      logger.error('加密配置失败:', error);
      throw error;
    }
  }

  /**
   * 配置字段级加密
   */
  private async configureFieldLevelEncryption() {
    const encryptionKey = process.env.DB_ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error('未配置数据库加密密钥');
    }

    // 创建加密密钥
    const key = crypto.createHash('sha256').update(encryptionKey).digest();

    // 配置加密选项
    const encryptionOptions = {
      keyId: 'main',
      key,
      algorithm: 'aes-256-cbc',
    };

    // 存储加密配置
    await mongoose.connection.db.collection('encryption_keys').updateOne(
      { _id: 'main' },
      {
        $set: {
          key: encryptionKey,
          createdAt: new Date(),
          algorithm: encryptionOptions.algorithm,
        },
      },
      { upsert: true },
    );
  }

  /**
   * 配置审计日志
   */
  private async configureAuditLogging() {
    try {
      // 启用审计日志
      await mongoose.connection.db.command({
        setParameter: 1,
        auditAuthorizationSuccess: true,
      });

      // 创建审计日志集合
      await mongoose.connection.db.createCollection('audit_log', {
        capped: true,
        size: 5242880, // 5MB
        max: 5000,
      });
    } catch (error) {
      logger.error('审计日志配置失败:', error);
      throw error;
    }
  }

  /**
   * 加密敏感数据
   */
  async encryptData(data: string): Promise<string> {
    try {
      const encryptionKey = process.env.DB_ENCRYPTION_KEY;
      if (!encryptionKey) {
        throw new Error('未配置数据库加密密钥');
      }

      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      logger.error('数据加密失败:', error);
      throw error;
    }
  }

  /**
   * 解密数据
   */
  async decryptData(encryptedData: string): Promise<string> {
    try {
      const encryptionKey = process.env.DB_ENCRYPTION_KEY;
      if (!encryptionKey) {
        throw new Error('未配置数据库加密密钥');
      }

      const [ivHex, encrypted] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(encryptionKey, 'hex'),
        iv,
      );

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('数据解密失败:', error);
      throw error;
    }
  }

  /**
   * 审计日志记录
   */
  async logAuditEvent(event: { userId: string; action: string; resource: string; details?: any }) {
    try {
      await mongoose.connection.db.collection('audit_log').insertOne({
        ...event,
        timestamp: new Date(),
        ipAddress: this.getClientIp(),
        userAgent: this.getUserAgent(),
      });
    } catch (error) {
      logger.error('审计日志记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取客户端IP
   */
  private getClientIp(): string {
    // 实际实现需要从请求上下文中获取
    return 'unknown';
  }

  /**
   * 获取用户代理
   */
  private getUserAgent(): string {
    // 实际实现需要从请求上下文中获取
    return 'unknown';
  }

  /**
   * 检查数据库安全状态
   */
  async checkSecurityStatus() {
    try {
      const adminDb = mongoose.connection.db.admin();
      const serverStatus = await adminDb.serverStatus();

      return {
        sslEnabled: serverStatus.security?.SSLServerHasCertificateAuthority || false,
        authEnabled: serverStatus.security?.authentication?.mechanisms?.length > 0,
        auditingEnabled: serverStatus.auditLog?.destination ? true : false,
        encryptionEnabled: process.env.DB_ENCRYPTION_KEY ? true : false,
        rolesConfigured: await this.checkRolesExist(),
      };
    } catch (error) {
      logger.error('安全状态检查失败:', error);
      throw error;
    }
  }

  /**
   * 检查角色是否存在
   */
  private async checkRolesExist(): Promise<boolean> {
    try {
      const roles = await mongoose.connection.db.command({ rolesInfo: 1 });
      const requiredRoles = ['readOnlyRole', 'readWriteRole', 'adminRole'];
      return requiredRoles.every(role => roles.roles.some((r: any) => r.role === role));
    } catch (error) {
      return false;
    }
  }
}

export const databaseSecurityService = new DatabaseSecurityService();
