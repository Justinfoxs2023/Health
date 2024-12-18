import { PerformanceOptimizer } from '@/utils/PerformanceOptimizer';

interface ICacheStrategy {
  /** type 的描述 */
    type: memory  localStorage  indexedDB;
  ttl: number;
  maxSize: number;
  priority: high  normal  low;
}

export class CacheStrategyService {
  private static memoryCache = new Map();
  private static db: IDBDatabase;

  // 多级缓存
  static async get(key: string, strategies: ICacheStrategy[]) {
    for (const strategy of strategies) {
      const value = await this.getFromStrategy(key, strategy);
      if (value) return value;
    }
    return null;
  }

  // 缓存预热
  static async warmup(keys: string[]) {
    const warmupPromises = keys.map(async key => {
      const data = await this.fetchData(key);
      await this.set(key, data, {
        type: 'memory',
        ttl: 5 * 60 * 1000, // 5分钟
      });
    });

    await Promise.all(warmupPromises);
  }

  // 缓存清理
  static async cleanup() {
    // 清理内存缓存
    for (const [key, value] of this.memoryCache.entries()) {
      if (this.isExpired(value)) {
        this.memoryCache.delete(key);
      }
    }

    // 清理localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        const value = JSON.parse(localStorage.getItem(key) || '{}');
        if (this.isExpired(value)) {
          localStorage.removeItem(key);
        }
      }
    }

    // 清理IndexedDB
    // ... IndexedDB清理逻辑
  }

  // LRU缓存实现
  private static lruCache = {
    capacity: 1000,
    cache: new Map(),

    get(key: string) {
      if (!this.cache.has(key)) return null;

      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    },

    put(key: string, value: any) {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      } else if (this.cache.size >= this.capacity) {
        this.cache.delete(this.cache.keys().next().value);
      }
      this.cache.set(key, value);
    },
  };
}
