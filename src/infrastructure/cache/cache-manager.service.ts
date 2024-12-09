import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { RedisService } from '../redis/redis.service';
import { MetricsService } from '../monitoring/metrics.service';
import { Logger } from '../logger/logger.service';

interface CacheConfig {
  localTTL: number;
  remoteTTL: number;
  maxSize: number;
  syncInterval: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
}

@Injectable()
export class CacheManagerService implements OnModuleInit {
  private readonly localCache: Map<string, { value: any; expiry: number }>;
  private readonly config: CacheConfig;
  private readonly stats: CacheStats = { hits: 0, misses: 0, evictions: 0 };
  private readonly logger = new Logger(CacheManagerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly metrics: MetricsService
  ) {
    this.localCache = new Map();
    this.config = {
      localTTL: parseInt(configService.get('CACHE_LOCAL_TTL') || '300000'),
      remoteTTL: parseInt(configService.get('CACHE_REMOTE_TTL') || '3600000'),
      maxSize: parseInt(configService.get('CACHE_MAX_SIZE') || '1000'),
      syncInterval: parseInt(configService.get('CACHE_SYNC_INTERVAL') || '60000')
    };
  }

  async onModuleInit() {
    this.startCacheSync();
    this.startMetricsCollection();
  }

  private startCacheSync() {
    setInterval(() => {
      this.syncWithRedis().catch(error => {
        this.logger.error('Cache sync failed:', error);
      });
    }, this.config.syncInterval);
  }

  private startMetricsCollection() {
    setInterval(() => {
      this.metrics.recordCacheStats({
        hits: this.stats.hits,
        misses: this.stats.misses,
        evictions: this.stats.evictions,
        size: this.localCache.size
      });
    }, 5000);
  }

  async get<T>(key: string): Promise<T | null> {
    // 先检查本地缓存
    const localValue = this.getFromLocalCache<T>(key);
    if (localValue !== null) {
      this.stats.hits++;
      return localValue;
    }

    // 检查Redis缓存
    const remoteValue = await this.getFromRedis<T>(key);
    if (remoteValue !== null) {
      this.stats.hits++;
      // 回填本地缓存
      this.setToLocalCache(key, remoteValue);
      return remoteValue;
    }

    this.stats.misses++;
    return null;
  }

  async set(key: string, value: any, options?: {
    localTTL?: number;
    remoteTTL?: number;
    onlyLocal?: boolean;
  }): Promise<void> {
    const { localTTL = this.config.localTTL, remoteTTL = this.config.remoteTTL, onlyLocal = false } = options || {};

    // 设置本地缓存
    this.setToLocalCache(key, value, localTTL);

    // 设置Redis缓存
    if (!onlyLocal) {
      await this.setToRedis(key, value, remoteTTL);
    }
  }

  private getFromLocalCache<T>(key: string): T | null {
    const item = this.localCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.localCache.delete(key);
      return null;
    }

    return item.value;
  }

  private async getFromRedis<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting key ${key} from Redis:`, error);
      return null;
    }
  }

  private setToLocalCache(key: string, value: any, ttl: number = this.config.localTTL): void {
    // 检查缓存大小
    if (this.localCache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.localCache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  private async setToRedis(key: string, value: any, ttl: number = this.config.remoteTTL): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), ttl);
    } catch (error) {
      this.logger.error(`Error setting key ${key} to Redis:`, error);
    }
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, item] of this.localCache.entries()) {
      if (item.expiry < oldestTime) {
        oldestTime = item.expiry;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.localCache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  private async syncWithRedis(): Promise<void> {
    const keys = Array.from(this.localCache.keys());
    const values = await Promise.all(keys.map(key => this.getFromRedis(key)));

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];
      if (value !== null) {
        this.setToLocalCache(key, value);
      }
    }
  }

  async invalidate(key: string): Promise<void> {
    this.localCache.delete(key);
    await this.redis.del(key);
  }

  async clear(): Promise<void> {
    this.localCache.clear();
    await this.redis.flushdb();
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }
} 