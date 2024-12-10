import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Logger } from './logger.service';

interface EncryptionConfig {
  algorithm: string;
  key: Buffer;
  iv: Buffer;
}

interface AuditLog {
  action: string;
  collection: string;
  userId: string;
  timestamp: Date;
  details: any;
}

@Injectable()
export class DatabaseSecurityService {
  private readonly encryptionConfig: EncryptionConfig;
  private readonly auditLogs: AuditLog[] = [];
  private readonly MAX_AUDIT_LOGS = 10000;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly logger: Logger,
  ) {
    // 初始化加密配置
    this.encryptionConfig = {
      algorithm: 'aes-256-cbc',
      key: Buffer.from(process.env.ENCRYPTION_KEY || randomBytes(32)),
      iv: Buffer.from(process.env.ENCRYPTION_IV || randomBytes(16))
    };
  }

  /**
   * 加密数据
   */
  async encryptData(data: any): Promise<string> {
    try {
      const cipher = createCipheriv(
        this.encryptionConfig.algorithm,
        this.encryptionConfig.key,
        this.encryptionConfig.iv
      );
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return encrypted;
    } catch (error) {
      this.logger.error(`Failed to encrypt data: ${error.message}`);
      throw error;
    }
  }

  /**
   * 解密数据
   */
  async decryptData(encryptedData: string): Promise<any> {
    try {
      const decipher = createDecipheriv(
        this.encryptionConfig.algorithm,
        this.encryptionConfig.key,
        this.encryptionConfig.iv
      );
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      this.logger.error(`Failed to decrypt data: ${error.message}`);
      throw error;
    }
  }

  /**
   * 记录审计日志
   */
  async logAuditEvent(event: AuditLog): Promise<void> {
    try {
      this.auditLogs.push(event);
      
      // 限制审计日志大小
      if (this.auditLogs.length > this.MAX_AUDIT_LOGS) {
        this.auditLogs.shift();
      }

      // 记录到数据库
      await this.connection.db
        .collection('audit_logs')
        .insertOne({
          ...event,
          encrypted: await this.encryptData(event.details)
        });

      this.logger.info(`Audit log recorded for action: ${event.action}`);
    } catch (error) {
      this.logger.error(`Failed to log audit event: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取审计日志
   */
  async getAuditLogs(filter: any = {}): Promise<AuditLog[]> {
    try {
      const logs = await this.connection.db
        .collection('audit_logs')
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(100)
        .toArray();

      // 解密详情
      return await Promise.all(logs.map(async log => ({
        ...log,
        details: await this.decryptData(log.encrypted)
      })));
    } catch (error) {
      this.logger.error(`Failed to get audit logs: ${error.message}`);
      throw error;
    }
  }

  /**
   * 检查访问权限
   */
  async checkAccess(userId: string, collection: string, action: string): Promise<boolean> {
    try {
      const accessRules = await this.connection.db
        .collection('access_rules')
        .findOne({ userId, collection });

      if (!accessRules) {
        return false;
      }

      const hasAccess = accessRules.permissions.includes(action);
      
      // 记录访问检查
      await this.logAuditEvent({
        action: 'access_check',
        collection,
        userId,
        timestamp: new Date(),
        details: {
          action,
          result: hasAccess
        }
      });

      return hasAccess;
    } catch (error) {
      this.logger.error(`Failed to check access: ${error.message}`);
      throw error;
    }
  }

  /**
   * 授予访问权限
   */
  async grantAccess(userId: string, collection: string, permissions: string[]): Promise<void> {
    try {
      await this.connection.db
        .collection('access_rules')
        .updateOne(
          { userId, collection },
          { 
            $addToSet: { permissions: { $each: permissions } }
          },
          { upsert: true }
        );

      // 记录权限变更
      await this.logAuditEvent({
        action: 'grant_access',
        collection,
        userId,
        timestamp: new Date(),
        details: { permissions }
      });

      this.logger.info(`Access granted to user ${userId} for collection ${collection}`);
    } catch (error) {
      this.logger.error(`Failed to grant access: ${error.message}`);
      throw error;
    }
  }

  /**
   * 撤销访问权限
   */
  async revokeAccess(userId: string, collection: string, permissions: string[]): Promise<void> {
    try {
      await this.connection.db
        .collection('access_rules')
        .updateOne(
          { userId, collection },
          { 
            $pullAll: { permissions }
          }
        );

      // 记录权限变更
      await this.logAuditEvent({
        action: 'revoke_access',
        collection,
        userId,
        timestamp: new Date(),
        details: { permissions }
      });

      this.logger.info(`Access revoked from user ${userId} for collection ${collection}`);
    } catch (error) {
      this.logger.error(`Failed to revoke access: ${error.message}`);
      throw error;
    }
  }

  /**
   * 检查数据完整性
   */
  async checkDataIntegrity(collection: string): Promise<boolean> {
    try {
      const documents = await this.connection.db
        .collection(collection)
        .find({})
        .toArray();

      let isValid = true;
      for (const doc of documents) {
        if (doc.encrypted) {
          try {
            await this.decryptData(doc.encrypted);
          } catch (error) {
            isValid = false;
            this.logger.error(`Data integrity check failed for document ${doc._id}`);
          }
        }
      }

      // 记录完整性检查
      await this.logAuditEvent({
        action: 'integrity_check',
        collection,
        userId: 'system',
        timestamp: new Date(),
        details: { result: isValid }
      });

      return isValid;
    } catch (error) {
      this.logger.error(`Failed to check data integrity: ${error.message}`);
      throw error;
    }
  }

  /**
   * 清理敏感数据
   */
  async sanitizeData(data: any, sensitiveFields: string[]): Promise<any> {
    try {
      const sanitized = { ...data };
      
      for (const field of sensitiveFields) {
        if (sanitized[field]) {
          if (typeof sanitized[field] === 'string') {
            sanitized[field] = await this.encryptData(sanitized[field]);
          } else {
            delete sanitized[field];
          }
        }
      }

      return sanitized;
    } catch (error) {
      this.logger.error(`Failed to sanitize data: ${error.message}`);
      throw error;
    }
  }

  /**
   * 检查安全漏洞
   */
  async checkSecurityVulnerabilities(): Promise<any[]> {
    try {
      const vulnerabilities = [];

      // 检查未加密的敏感字段
      const collections = await this.connection.db.collections();
      for (const collection of collections) {
        const unencryptedDocs = await collection.find({
          $or: [
            { encrypted: { $exists: false } },
            { encrypted: null }
          ]
        }).toArray();

        if (unencryptedDocs.length > 0) {
          vulnerabilities.push({
            type: 'unencrypted_data',
            collection: collection.collectionName,
            count: unencryptedDocs.length
          });
        }
      }

      // 检查过期的访问规则
      const expiredRules = await this.connection.db
        .collection('access_rules')
        .find({
          expiresAt: { $lt: new Date() }
        })
        .toArray();

      if (expiredRules.length > 0) {
        vulnerabilities.push({
          type: 'expired_access_rules',
          count: expiredRules.length
        });
      }

      // 记录漏洞检查
      await this.logAuditEvent({
        action: 'vulnerability_check',
        collection: 'system',
        userId: 'system',
        timestamp: new Date(),
        details: { vulnerabilities }
      });

      return vulnerabilities;
    } catch (error) {
      this.logger.error(`Failed to check security vulnerabilities: ${error.message}`);
      throw error;
    }
  }
} 