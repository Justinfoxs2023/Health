import * as crypto from 'crypto';

import { EncryptionError } from '@/utils/errors';
import { Logger } from '@/utils/Logger';

export class DataEncryptionService {
  private logger: Logger;
  private algorithm: string;
  private secretKey: Buffer;
  private iv: Buffer;

  constructor() {
    this.logger = new Logger('DataEncryption');
    this.algorithm = 'aes-256-gcm';
    this.secretKey = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
    this.iv = crypto.randomBytes(16);
  }

  /**
   * 加密数据
   */
  async encrypt(data: any): Promise<string> {
    try {
      // 将数据转换为字符串
      const text = JSON.stringify(data);

      // 创建加密器
      const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);

      // 加密数据
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // 获取认证标签
      const authTag = cipher.getAuthTag();

      // 组合加密结果
      const result = {
        iv: this.iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag.toString('hex'),
      };

      return JSON.stringify(result);
    } catch (error) {
      this.logger.error('数据加密失败', error);
      throw new EncryptionError('ENCRYPTION_FAILED', error.message);
    }
  }

  /**
   * 解密数据
   */
  async decrypt(encryptedData: string): Promise<any> {
    try {
      // 解析加密数据
      const { iv, encryptedData: data, authTag } = JSON.parse(encryptedData);

      // 创建解密器
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.secretKey,
        Buffer.from(iv, 'hex'),
      );

      // 设置认证标签
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      // 解密数据
      let decrypted = decipher.update(data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      this.logger.error('数据解密失败', error);
      throw new EncryptionError('DECRYPTION_FAILED', error.message);
    }
  }

  /**
   * 生成加密密钥
   */
  static generateKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * 验证数据完整性
   */
  async verifyIntegrity(encryptedData: string, originalHash: string): Promise<boolean> {
    try {
      const data = await this.decrypt(encryptedData);
      const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
      return hash === originalHash;
    } catch (error) {
      this.logger.error('数据完整性验证失败', error);
      throw new EncryptionError('INTEGRITY_CHECK_FAILED', error.message);
    }
  }
}
