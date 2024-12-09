import { Injectable } from '@nestjs/common';
import { Cache, caching } from 'cache-manager';
import { CacheConfig } from '@/types/storage-config';

@Injectable()
export class CacheManager {
  private cache: Cache;

  constructor(config: CacheConfig) {
    this.cache = caching({
      store: 'memory',
      max: config.maxSize * 1024 * 1024, // 转换为字节
      ttl: config.maxAge
    });

    // 启动定期清理
    if (config.cleanupInterval > 0) {
      setInterval(() => this.cleanup(), config.cleanupInterval * 1000);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    return this.cache.get<T>(key);
  }

  async set(key: string, value: any, options?: { ttl?: number }): Promise<void> {
    await this.cache.set(key, value, options);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async reset(): Promise<void> {
    await this.cache.reset();
  }

  private async cleanup(): Promise<void> {
    try {
      await this.cache.reset();
    } catch (error) {
      console.error('Cache cleanup failed:', error);
    }
  }
} 