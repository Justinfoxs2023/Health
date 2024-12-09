import * as crypto from 'crypto';

export class CryptoUtils {
  private static readonly algorithm = 'aes-256-gcm';
  private static readonly keyLength = 32;
  private static readonly ivLength = 16;
  private static readonly saltLength = 64;
  private static readonly tagLength = 16;

  // 生成密钥
  static async generateKey(
    password: string,
    salt?: Buffer
  ): Promise<{ key: Buffer; salt: Buffer }> {
    const useSalt = salt || crypto.randomBytes(this.saltLength);
    const key = await new Promise<Buffer>((resolve, reject) => {
      crypto.scrypt(password, useSalt, this.keyLength, (err, key) => {
        if (err) reject(err);
        resolve(key);
      });
    });
    return { key, salt: useSalt };
  }

  // 加密数据
  static async encrypt(
    data: string,
    password: string
  ): Promise<{ encrypted: string; iv: string; tag: string; salt: string }> {
    const { key, salt } = await this.generateKey(password);
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
      salt: salt.toString('hex')
    };
  }

  // 解密数据
  static async decrypt(
    encrypted: string,
    password: string,
    iv: string,
    tag: string,
    salt: string
  ): Promise<string> {
    const { key } = await this.generateKey(password, Buffer.from(salt, 'hex'));
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      key,
      Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
} 