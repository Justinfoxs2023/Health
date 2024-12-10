import { BehaviorSubject } from 'rxjs';
import CryptoJS from 'crypto-js';

interface SecurityConfig {
  encryptionKey: string;
  signatureKey: string;
  allowedTypes: string[];
  maxSize: number; // MB
  expirationTime: number; // 毫秒
}

interface SecurityState {
  processing: boolean;
  error: Error | null;
}

export class ImageSecurityService {
  private config: SecurityConfig;
  private state$ = new BehaviorSubject<SecurityState>({
    processing: false,
    error: null
  });

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = {
      encryptionKey: process.env.IMAGE_ENCRYPTION_KEY || 'default-key',
      signatureKey: process.env.IMAGE_SIGNATURE_KEY || 'default-signature-key',
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxSize: 10, // 默认10MB
      expirationTime: 24 * 60 * 60 * 1000, // 默认24小时
      ...config
    };
  }

  // 验证图片
  async validateImage(file: File): Promise<boolean> {
    try {
      this.updateState({ processing: true });

      // 验证文件类型
      if (!this.config.allowedTypes.includes(file.type)) {
        throw new Error('不支持的图片格式');
      }

      // 验证文件大小
      if (file.size / (1024 * 1024) > this.config.maxSize) {
        throw new Error(`图片大小不能超过 ${this.config.maxSize}MB`);
      }

      // 验证图片内容
      const isValid = await this.validateImageContent(file);
      if (!isValid) {
        throw new Error('图片内容验证失败');
      }

      this.updateState({ processing: false });
      return true;
    } catch (error) {
      this.updateState({ processing: false, error });
      throw error;
    }
  }

  // 生成签名URL
  generateSignedUrl(url: string, expirationTime = this.config.expirationTime): string {
    const timestamp = Date.now();
    const expiry = timestamp + expirationTime;
    const signature = this.generateSignature(url, expiry);

    const urlObj = new URL(url);
    urlObj.searchParams.set('signature', signature);
    urlObj.searchParams.set('expiry', expiry.toString());

    return urlObj.toString();
  }

  // 验证签名URL
  validateSignedUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const signature = urlObj.searchParams.get('signature');
      const expiry = parseInt(urlObj.searchParams.get('expiry') || '0', 10);

      if (!signature || !expiry) {
        return false;
      }

      // ���查是否过期
      if (Date.now() > expiry) {
        return false;
      }

      // 移除签名参数后验证
      urlObj.searchParams.delete('signature');
      const expectedSignature = this.generateSignature(urlObj.toString(), expiry);

      return signature === expectedSignature;
    } catch {
      return false;
    }
  }

  // 加密图片数据
  async encryptImage(file: File): Promise<Blob> {
    try {
      this.updateState({ processing: true });

      const arrayBuffer = await file.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const encrypted = CryptoJS.AES.encrypt(wordArray, this.config.encryptionKey);

      const encryptedBlob = new Blob([encrypted.toString()], {
        type: 'application/octet-stream'
      });

      this.updateState({ processing: false });
      return encryptedBlob;
    } catch (error) {
      this.updateState({ processing: false, error });
      throw error;
    }
  }

  // 解密图片数据
  async decryptImage(encryptedBlob: Blob): Promise<Blob> {
    try {
      this.updateState({ processing: true });

      const text = await encryptedBlob.text();
      const decrypted = CryptoJS.AES.decrypt(text, this.config.encryptionKey);
      const typedArray = this.convertWordArrayToUint8Array(decrypted);

      const decryptedBlob = new Blob([typedArray], { type: 'image/jpeg' });

      this.updateState({ processing: false });
      return decryptedBlob;
    } catch (error) {
      this.updateState({ processing: false, error });
      throw error;
    }
  }

  // 生成防篡改哈希
  async generateImageHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    return CryptoJS.SHA256(wordArray).toString();
  }

  // 验证图片哈希
  async validateImageHash(file: File, hash: string): Promise<boolean> {
    const currentHash = await this.generateImageHash(file);
    return currentHash === hash;
  }

  // 获取状态流
  getState() {
    return this.state$.asObservable();
  }

  // 私有方法：更新状态
  private updateState(partial: Partial<SecurityState>) {
    this.state$.next({
      ...this.state$.value,
      ...partial
    });
  }

  // 私有方法：生成签名
  private generateSignature(url: string, expiry: number): string {
    const data = `${url}${expiry}`;
    return CryptoJS.HmacSHA256(data, this.config.signatureKey).toString();
  }

  // 私有方法：验证图片内容
  private async validateImageContent(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  }

  // 私有方法：WordArray转Uint8Array
  private convertWordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);

    for (let i = 0; i < sigBytes; i++) {
      const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      u8[i] = byte;
    }

    return u8;
  }

  // 销毁服务
  destroy() {
    this.state$.complete();
  }
} 