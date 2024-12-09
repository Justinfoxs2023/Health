import { LocalDatabase } from '../utils/local-database';

interface CacheConfig {
  maxAge: number;
  maxSize: number;
  priority: 'lru' | 'lfu' | 'fifo';
}

export class CacheStrategyService {
  private db: LocalDatabase;
  private config: CacheConfig;
  private memoryCache: Map<string, any>;
  private accessCount: Map<string, number>;

  constructor(config: Partial<CacheConfig> = {}) {
    this.db = new LocalDatabase('cache-store');
    this.config = {
      maxAge: 24 * 60 * 60 * 1000, // 24小时
      maxSize: 100 * 1024 * 1024,   // 100MB
      priority: 'lru',
      ...config
    };
    this.memoryCache = new Map();
    this.accessCount = new Map();
  }

  async get(key: string): Promise<any> {
    // 先检查内存缓存
    if (this.memoryCache.has(key)) {
      this.updateAccessMetrics(key);
      return this.memoryCache.get(key);
    }

    // 检查持久化缓存
    const cached = await this.db.get(key);
    if (cached && !this.isExpired(cached)) {
      this.memoryCache.set(key, cached.data);
      this.updateAccessMetrics(key);
      return cached.data;
    }

    return null;
  }

  async set(key: string, value: any, config?: Partial<CacheConfig>): Promise<void> {
    const cacheConfig = { ...this.config, ...config };

    // 检查缓存大小限制
    await this.ensureCacheSize();

    // 存储到内存和持久化存储
    this.memoryCache.set(key, value);
    await this.db.put(key, {
      data: value,
      timestamp: Date.now(),
      config: cacheConfig
    });

    this.updateAccessMetrics(key);
  }

  private async ensureCacheSize(): Promise<void> {
    const currentSize = await this.calculateCacheSize();
    if (currentSize > this.config.maxSize) {
      await this.evictCache();
    }
  }

  private async evictCache(): Promise<void> {
    let entries: Array<[string, number]>;

    switch (this.config.priority) {
      case 'lru':
        entries = Array.from(this.accessCount.entries())
          .sort(([, a], [, b]) => a - b);
        break;
      case 'lfu':
        entries = Array.from(this.accessCount.entries())
          .sort(([, a], [, b]) => b - a);
        break;
      case 'fifo':
      default:
        entries = Array.from(this.accessCount.entries());
    }

    // 移除最低优先级的缓存直到满足大小限制
    for (const [key] of entries) {
      await this.remove(key);
      const currentSize = await this.calculateCacheSize();
      if (currentSize <= this.config.maxSize * 0.8) {
        break;
      }
    }
  }

  private updateAccessMetrics(key: string): void {
    const count = this.accessCount.get(key) || 0;
    this.accessCount.set(key, count + 1);
  }

  private isExpired(cached: any): boolean {
    return Date.now() - cached.timestamp > cached.config.maxAge;
  }

  private async calculateCacheSize(): Promise<number> {
    const keys = await this.db.getAllKeys();
    let size = 0;
    for (const key of keys) {
      const value = await this.db.get(key);
      size += new Blob([JSON.stringify(value)]).size;
    }
    return size;
  }

  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);
    this.accessCount.delete(key);
    await this.db.delete(key);
  }
} 