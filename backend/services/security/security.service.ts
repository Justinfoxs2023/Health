import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { EventEmitter } from 'events';
import { Logger } from '../../utils/logger';
import { Redis } from '../../utils/redis';

interface ISecurityConfig {
  /** jwtSecret 的描述 */
  jwtSecret: string;
  /** tokenExpiration 的描述 */
  tokenExpiration: number;
  /** rateLimitWindow 的描述 */
  rateLimitWindow: number;
  /** rateLimitMax 的描述 */
  rateLimitMax: number;
  /** encryptionKey 的描述 */
  encryptionKey: string;
}

export class SecurityService extends EventEmitter {
  private logger: Logger;
  private redis: Redis;
  private config: ISecurityConfig;

  constructor(config: ISecurityConfig) {
    super();
    this.logger = new Logger('SecurityService');
    this.redis = new Redis();
    this.config = config;
  }

  // 数据加密
  async encryptData(data: any): Promise<string> {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.config.encryptionKey, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return JSON.stringify({
      iv: iv.toString('hex'),
      encryptedData: encrypted,
      authTag: authTag.toString('hex'),
    });
  }

  // 数据解密
  async decryptData(encryptedData: string): Promise<any> {
    const { iv, encryptedData: data, authTag } = JSON.parse(encryptedData);

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.config.encryptionKey,
      Buffer.from(iv, 'hex'),
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  // 速率限制检查
  async checkRateLimit(key: string): Promise<boolean> {
    const current = await this.redis.incr(`ratelimit:${key}`);
    if (current === 1) {
      await this.redis.expire(`ratelimit:${key}`, this.config.rateLimitWindow);
    }
    return current <= this.config.rateLimitMax;
  }

  // 生成JWT令牌
  generateToken(payload: any): string {
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.tokenExpiration,
    });
  }

  // 验证JWT令牌
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.config.jwtSecret);
    } catch (error) {
      this.logger.error('Token验证失败:', error);
      throw error;
    }
  }
}
