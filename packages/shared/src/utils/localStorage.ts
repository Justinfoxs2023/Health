import { ICacheOptions, ICacheEntry } from '../types/cache';

export class LocalStorage {
  private readonly prefix: string;
  private readonly options: ICacheOptions;

  constructor(options: ICacheOptions = {}) {
    this.prefix = options.prefix || 'health_';
    this.options = options;
  }

  /** 设置缓存 */
  set<T>(key: string, value: T): void {
    const entry: ICacheEntry<T> = {
      data: value,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0,
    };

    if (this.options.ttl) {
      entry.expireAt = Date.now() + this.options.ttl;
    }

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.clearExpired();
        try {
          localStorage.setItem(this.prefix + key, JSON.stringify(entry));
        } catch {
          console.error(
            'Error in localStorage.ts:',
            'Storage quota exceeded even after clearing expired items',
          );
        }
      }
    }
  }

  /** 获取缓存 */
  get<T>(key: string): T | null {
    const item = localStorage.getItem(this.prefix + key);
    if (!item) return null;

    try {
      const entry = JSON.parse(item) as ICacheEntry<T>;

      if (entry.expireAt && entry.expireAt < Date.now()) {
        this.delete(key);
        return null;
      }

      // 更新访问信息
      entry.lastAccessed = Date.now();
      entry.accessCount++;
      this.set(key, entry.data);

      return entry.data;
    } catch {
      return null;
    }
  }

  /** 删除缓存 */
  delete(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /** 清空缓存 */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /** 清理过期缓存 */
  private clearExpired(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const entry = JSON.parse(item) as ICacheEntry<unknown>;
            if (entry.expireAt && entry.expireAt < Date.now()) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // 如果解析失败，删除该项
          localStorage.removeItem(key);
        }
      }
    });
  }

  /** 获取缓存大小（字节） */
  getSize(): number {
    let size = 0;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const item = localStorage.getItem(key);
        if (item) {
          size += key.length + item.length;
        }
      }
    });
    return size * 2; // UTF-16 编码每个字符占2字节
  }
}
