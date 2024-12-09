import { Logger } from '../../utils/logger';
import { Encryption } from '../../utils/encryption';
import { SecurityConfig } from '../../types/security';

export class DataEncryptionService {
  private logger: Logger;
  private encryption: Encryption;

  constructor() {
    this.logger = new Logger('DataEncryption');
    this.encryption = new Encryption();
  }

  // 数据加密
  async encryptData(data: any, config: SecurityConfig): Promise<EncryptedData> {
    try {
      // 1. 数据分类
      const classified = await this.classifyData(data);
      
      // 2. 选择加密策略
      const strategy = this.selectEncryptionStrategy(classified);
      
      // 3. 执行加密
      const encrypted = await this.applyEncryption(classified, strategy);
      
      // 4. 生成密钥信息
      const keyInfo = await this.generateKeyInfo(encrypted);
      
      return {
        data: encrypted,
        keyInfo,
        metadata: {
          timestamp: new Date(),
          strategy: strategy.type
        }
      };
    } catch (error) {
      this.logger.error('数据加密失败', error);
      throw error;
    }
  }

  // 数据解密
  async decryptData(encrypted: EncryptedData, keyInfo: KeyInfo): Promise<any> {
    try {
      // 1. 验证密钥
      await this.validateKeyInfo(keyInfo);
      
      // 2. 执行解密
      const decrypted = await this.applyDecryption(encrypted.data, keyInfo);
      
      // 3. 验证完整性
      await this.verifyDataIntegrity(decrypted);
      
      return decrypted;
    } catch (error) {
      this.logger.error('数据解密失败', error);
      throw error;
    }
  }
} 