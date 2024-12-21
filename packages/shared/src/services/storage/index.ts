import { STORAGE_KEYS } from '../../constants';

/** 存储驱动类型 */
export type StorageDriverType = 'localStorage' | 'sessionStorage' | 'indexedDB';

/** 存储配置 */
export interface IStorageConfig {
  /** 存储驱动 */
  driver: StorageDriverType;
  /** 存储前缀 */
  prefix?: string;
  /** 加密密钥 */
  encryptionKey?: string;
  /** 数据压缩 */
  compress?: boolean;
  /** 过期时间（毫秒） */
  ttl?: number;
}

/** 存储项配置 */
export interface IStorageItemConfig {
  /** 过期时间（毫秒） */
  ttl?: number;
  /** 是否加密 */
  encrypt?: boolean;
  /** 是否压缩 */
  compress?: boolean;
}

/** 存储项元数据 */
interface IStorageItemMeta {
  /** 过期时间 */
  expiredAt?: number;
  /** 是否加密 */
  encrypted?: boolean;
  /** 是否压缩 */
  compressed?: boolean;
  /** 创建时间 */
  createdAt: number;
  /** 更新时间 */
  updatedAt: number;
}

/** 存储项数据 */
interface IStorageItem<T = any> {
  /** 数据 */
  data: T;
  /** 元数据 */
  meta: IStorageItemMeta;
}

/** 数据持久化服务 */
class StorageService {
  private static instance: StorageService;
  private driver: Storage | IDBDatabase;
  private config: IStorageConfig;
  private dbName = 'health_app';
  private dbVersion = 1;
  private stores = ['health_data', 'user_data', 'app_settings'];

  private constructor(config: IStorageConfig) {
    this.config = {
      prefix: 'health_',
      compress: false,
      ...config,
    };
    this.initDriver();
  }

  public static getInstance(config: IStorageConfig = { driver: 'localStorage' }): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService(config);
    }
    return StorageService.instance;
  }

  /** 设置存储项 */
  public async setItem<T>(key: string, value: T, config?: IStorageItemConfig): Promise<void> {
    const storageKey = this.getStorageKey(key);
    const item: IStorageItem<T> = {
      data: value,
      meta: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        expiredAt: config?.ttl ? Date.now() + config.ttl : undefined,
        encrypted: config?.encrypt,
        compressed: config?.compress,
      },
    };

    if (config?.encrypt) {
      item.data = await this.encrypt(item.data);
    }

    if (config?.compress) {
      item.data = await this.compress(item.data);
    }

    if (this.config.driver === 'indexedDB') {
      await this.setIndexedDBItem(storageKey, item);
    } else {
      this.setWebStorageItem(storageKey, item);
    }
  }

  /** 获取存储项 */
  public async getItem<T>(key: string): Promise<T | null> {
    const storageKey = this.getStorageKey(key);
    let item: IStorageItem<T> | null;

    if (this.config.driver === 'indexedDB') {
      item = await this.getIndexedDBItem<T>(storageKey);
    } else {
      item = this.getWebStorageItem<T>(storageKey);
    }

    if (!item) return null;

    // 检查是否过期
    if (item.meta.expiredAt && item.meta.expiredAt < Date.now()) {
      await this.removeItem(key);
      return null;
    }

    let data = item.data;

    if (item.meta.compressed) {
      data = await this.decompress(data);
    }

    if (item.meta.encrypted) {
      data = await this.decrypt(data);
    }

    return data;
  }

  /** 移除存储项 */
  public async removeItem(key: string): Promise<void> {
    const storageKey = this.getStorageKey(key);

    if (this.config.driver === 'indexedDB') {
      await this.removeIndexedDBItem(storageKey);
    } else {
      (this.driver as Storage).removeItem(storageKey);
    }
  }

  /** 清空存储 */
  public async clear(): Promise<void> {
    if (this.config.driver === 'indexedDB') {
      await this.clearIndexedDB();
    } else {
      (this.driver as Storage).clear();
    }
  }

  /** 获取所有键 */
  public async keys(): Promise<string[]> {
    if (this.config.driver === 'indexedDB') {
      return this.getIndexedDBKeys();
    } else {
      return Object.keys(this.driver as Storage)
        .filter(key => key.startsWith(this.config.prefix!))
        .map(key => key.slice(this.config.prefix!.length));
    }
  }

  /** 获取存储大小 */
  public async size(): Promise<number> {
    const keys = await this.keys();
    let size = 0;

    for (const key of keys) {
      const item = await this.getItem(key);
      if (item) {
        size += new Blob([JSON.stringify(item)]).size;
      }
    }

    return size;
  }

  private async initDriver(): Promise<void> {
    switch (this.config.driver) {
      case 'localStorage':
        this.driver = localStorage;
        break;
      case 'sessionStorage':
        this.driver = sessionStorage;
        break;
      case 'indexedDB':
        this.driver = await this.initIndexedDB();
        break;
      default:
        throw new Error(`Unsupported storage driver: ${this.config.driver}`);
    }
  }

  private async initIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        });
      };
    });
  }

  private async setIndexedDBItem(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = (this.driver as IDBDatabase).transaction(this.stores, 'readwrite');
      const store = transaction.objectStore(this.stores[0]);
      const request = store.put(value, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async getIndexedDBItem<T>(key: string): Promise<IStorageItem<T> | null> {
    return new Promise((resolve, reject) => {
      const transaction = (this.driver as IDBDatabase).transaction(this.stores, 'readonly');
      const store = transaction.objectStore(this.stores[0]);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  private async removeIndexedDBItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = (this.driver as IDBDatabase).transaction(this.stores, 'readwrite');
      const store = transaction.objectStore(this.stores[0]);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = (this.driver as IDBDatabase).transaction(this.stores, 'readwrite');
      const store = transaction.objectStore(this.stores[0]);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async getIndexedDBKeys(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const transaction = (this.driver as IDBDatabase).transaction(this.stores, 'readonly');
      const store = transaction.objectStore(this.stores[0]);
      const request = store.getAllKeys();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result.map(String));
    });
  }

  private setWebStorageItem(key: string, value: any): void {
    try {
      (this.driver as Storage).setItem(key, JSON.stringify(value));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // 存储空间不足，尝试清理过期数据
        this.clearExpiredItems();
        // 重试存储
        (this.driver as Storage).setItem(key, JSON.stringify(value));
      } else {
        throw error;
      }
    }
  }

  private getWebStorageItem<T>(key: string): IStorageItem<T> | null {
    const value = (this.driver as Storage).getItem(key);
    return value ? JSON.parse(value) : null;
  }

  private async clearExpiredItems(): Promise<void> {
    const keys = await this.keys();
    for (const key of keys) {
      const item = await this.getItem(key);
      if (item && item.meta?.expiredAt && item.meta.expiredAt < Date.now()) {
        await this.removeItem(key);
      }
    }
  }

  private getStorageKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  private async encrypt(data: any): Promise<any> {
    if (!this.config.encryptionKey) {
      throw new Error('Encryption key is required for encryption');
    }
    // 这里实现加密逻辑，可以使用 Web Crypto API
    // 为简化示例，这里只返回原数据
    return data;
  }

  private async decrypt(data: any): Promise<any> {
    if (!this.config.encryptionKey) {
      throw new Error('Encryption key is required for decryption');
    }
    // 这里实现解密逻辑
    // 为简化示例，这里只返回原数据
    return data;
  }

  private async compress(data: any): Promise<any> {
    // 这里实现压缩逻辑
    // 为简化示例，这里只返回原数据
    return data;
  }

  private async decompress(data: any): Promise<any> {
    // 这里实现解压缩逻辑
    // 为简化示例，这里只返回原数据
    return data;
  }
}

/** 存储服务实例 */
export const storage = StorageService.getInstance();
