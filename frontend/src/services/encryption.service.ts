import CryptoJS from 'crypto-js';

export class EncryptionService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key';
  }

  // 加密数据
  encrypt(data: any): string {
    const jsonStr = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, this.secretKey).toString();
  }

  // 解密数据
  decrypt(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr);
  }

  // 生成数据哈希
  generateHash(data: any): string {
    return CryptoJS.SHA256(JSON.stringify(data)).toString();
  }
} 