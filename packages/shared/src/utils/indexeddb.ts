import { ICacheOptions, ICacheEntry } from '../types/cache';

export class IndexedDB {
  private db: IDBDatabase | null = null;
  private readonly dbName: string;
  private readonly version: number;
  private readonly options: ICacheOptions;

  constructor(dbName: string, version = 1, options: ICacheOptions = {}) {
    this.dbName = dbName;
    this.version = version;
    this.options = options;
  }

  /** 初始化数据库 */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  }

  /** 设置缓存 */
  async set<T>(key: string, value: T): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const entry: ICacheEntry<T> = {
      data: value,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0,
    };

    if (this.options.ttl) {
      entry.expireAt = Date.now() + this.options.ttl;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put({ key, ...entry });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /** 获取缓存 */
  async get<T>(key: string): Promise<T | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result as ICacheEntry<T> & { key: string };
        if (!entry) return resolve(null);

        if (entry.expireAt && entry.expireAt < Date.now()) {
          this.delete(key).catch(console.error);
          return resolve(null);
        }

        // 更新访问信息
        entry.lastAccessed = Date.now();
        entry.accessCount++;
        this.set(key, entry.data).catch(console.error);

        resolve(entry.data);
      };
    });
  }

  /** 删除缓存 */
  async delete(key: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /** 清空缓存 */
  async clear(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /** 关闭数据库连接 */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
