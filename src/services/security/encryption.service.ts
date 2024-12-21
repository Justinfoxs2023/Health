import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keySize = 32;
  private readonly ivSize = 16;
  private readonly saltSize = 64;
  private readonly tagSize = 16;
  private readonly pbkdf2Iterations = 100000;
  private readonly masterKey: Buffer;

  constructor(private readonly logger: Logger, private readonly configService: ConfigService) {
    // 初始化主密钥
    this.masterKey = this.deriveMasterKey(
      this.configService.get('ENCRYPTION_KEY'),
      this.configService.get('ENCRYPTION_SALT'),
    );
  }

  // 加密数据
  async encrypt(
    data: any,
    options?: {
      type?: 'symmetric' | 'asymmetric';
      keyId?: string;
    },
  ): Promise<string> {
    try {
      const type = options?.type || 'symmetric';

      if (type === 'asymmetric') {
        return await this.asymmetricEncrypt(data, options?.keyId);
      } else {
        return await this.symmetricEncrypt(data);
      }
    } catch (error) {
      this.logger.error('加密失败', error);
      throw error;
    }
  }

  // 解密数据
  async decrypt(
    encryptedData: string,
    options?: {
      type?: 'symmetric' | 'asymmetric';
      keyId?: string;
    },
  ): Promise<any> {
    try {
      const type = options?.type || 'symmetric';

      if (type === 'asymmetric') {
        return await this.asymmetricDecrypt(encryptedData, options?.keyId);
      } else {
        return await this.symmetricDecrypt(encryptedData);
      }
    } catch (error) {
      this.logger.error('解密数据失败', error);
      throw error;
    }
  }

  // 生成密钥对
  async generateKeyPair(): Promise<{
    publicKey: string;
    privateKey: string;
    keyId: string;
  }> {
    try {
      // 生成RSA密钥对
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });

      // 生成密钥ID
      const keyId = crypto.randomBytes(16).toString('hex');

      // 加密私钥
      const encryptedPrivateKey = await this.symmetricEncrypt(privateKey);

      // 保存密钥信息
      await this.saveKeyPair(keyId, publicKey, encryptedPrivateKey);

      return {
        publicKey,
        privateKey,
        keyId,
      };
    } catch (error) {
      this.logger.error('生成密钥对失败', error);
      throw error;
    }
  }

  // 哈希数据
  async hash(
    data: string,
    options?: {
      algorithm?: 'sha256' | 'sha512';
      salt?: string;
    },
  ): Promise<string> {
    try {
      const algorithm = options?.algorithm || 'sha256';
      const salt = options?.salt || crypto.randomBytes(this.saltSize).toString('hex');

      // 创建哈希
      const hash = crypto.createHash(algorithm);
      hash.update(salt + data);

      return salt + ':' + hash.digest('hex');
    } catch (error) {
      this.logger.error('哈希数据失败', error);
      throw error;
    }
  }

  // 验证哈希
  async verifyHash(data: string, hash: string): Promise<boolean> {
    try {
      const [salt, originalHash] = hash.split(':');
      const verifyHash = await this.hash(data, { salt });
      return verifyHash === hash;
    } catch (error) {
      this.logger.error('验证哈希失败', error);
      throw error;
    }
  }

  // 生成随机令牌
  async generateToken(length = 32): Promise<string> {
    try {
      return crypto.randomBytes(length).toString('hex');
    } catch (error) {
      this.logger.error('生成令牌失败', error);
      throw error;
    }
  }

  private async symmetricEncrypt(data: any): Promise<string> {
    try {
      // 生成初始化向量
      const iv = crypto.randomBytes(this.ivSize);

      // 创建加密器
      const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);

      // 加���数据
      const serializedData = JSON.stringify(data);
      const encryptedData = Buffer.concat([cipher.update(serializedData, 'utf8'), cipher.final()]);

      // 获取认证标签
      const authTag = cipher.getAuthTag();

      // 组合加密结果
      const result = Buffer.concat([iv, authTag, encryptedData]);

      return result.toString('base64');
    } catch (error) {
      this.logger.error('对称加密失败', error);
      throw error;
    }
  }

  private async symmetricDecrypt(encryptedData: string): Promise<any> {
    try {
      // 解析加密数据
      const data = Buffer.from(encryptedData, 'base64');

      // 提取组件
      const iv = data.slice(0, this.ivSize);
      const authTag = data.slice(this.ivSize, this.ivSize + this.tagSize);
      const encryptedContent = data.slice(this.ivSize + this.tagSize);

      // 创建解密器
      const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
      decipher.setAuthTag(authTag);

      // 解密数据
      const decryptedData = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);

      return JSON.parse(decryptedData.toString('utf8'));
    } catch (error) {
      this.logger.error('对称解密失败', error);
      throw error;
    }
  }

  private async asymmetricEncrypt(data: any, keyId: string): Promise<string> {
    try {
      // 获取公钥
      const publicKey = await this.getPublicKey(keyId);

      // 加密数据
      const encryptedData = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(JSON.stringify(data)),
      );

      return encryptedData.toString('base64');
    } catch (error) {
      this.logger.error('非对称加密失败', error);
      throw error;
    }
  }

  private async asymmetricDecrypt(encryptedData: string, keyId: string): Promise<any> {
    try {
      // 获取私钥
      const privateKey = await this.getPrivateKey(keyId);

      // 解密数据
      const decryptedData = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(encryptedData, 'base64'),
      );

      return JSON.parse(decryptedData.toString('utf8'));
    } catch (error) {
      this.logger.error('非对称解密失败', error);
      throw error;
    }
  }

  private deriveMasterKey(key: string, salt: string): Buffer {
    return crypto.pbkdf2Sync(key, salt, this.pbkdf2Iterations, this.keySize, 'sha512');
  }

  private async saveKeyPair(
    keyId: string,
    publicKey: string,
    encryptedPrivateKey: string,
  ): Promise<void> {
    // 实现密钥对保存逻辑
  }

  private async getPublicKey(keyId: string): Promise<string> {
    // 实现公钥获取逻辑
    return '';
  }

  private async getPrivateKey(keyId: string): Promise<string> {
    // 实现私钥获取逻辑
    return '';
  }
}
