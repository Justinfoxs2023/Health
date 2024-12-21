import { CacheConfig, CacheStats, CacheLevel } from '../types/cache.types';
import { Logger } from '../logger/Logger';
import { MemoryCache } from './MemoryCache';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { RedisClient } from '../../infrastructure/redis';
import { injectable, inject } from 'inversify';

@injectable()
export class CacheService {
  private readonly memoryCache: MemoryCache;
  private readonly cacheStats: Map<string, CacheStats>;

  constructor(
    @inject() private readonly logger: Logger,
    @inject() private readonly metrics: MetricsCollector,
    @inject() private readonly redis: RedisClient,
  ) {
    this.memoryCache = new MemoryCache();
    this.cacheStats = new Map();
    this.initializeMetrics();
  }

  /**
   * 初始化监控指标
   */
  private initializeMetrics(): void {
    this.metrics.registerGauge('cache_memory_size', 'Memory cache size in bytes');
    this.metrics.registerGauge('cache_memory_items', 'Number of items in memory cache');
    this.metrics.registerGauge('cache_redis_size', 'Redis cache size in bytes');
    this.metrics.registerCounter('cache_hits', 'Cache hit count');
    this.metrics.registerCounter('cache_misses', 'Cache miss count');
  }

  /**
   * 获取缓存数据
   */
  public async get<T>(key: string, options?: CacheConfig): Promise<T | null> {
    const timer = this.metrics.startTimer('cache_get');
    try {
      // 首先检查内存缓存
      const memoryResult = await this.getFromMemory<T>(key);
      if (memoryResult !== null) {
        this.recordCacheHit(key, CacheLevel.MEMORY);
        return memoryResult;
      }

      // 然后检查Redis缓存
      const redisResult = await this.getFromRedis<T>(key);
      if (redisResult !== null) {
        // 将数据回填到内存缓存
        await this.setInMemory(key, redisResult, options);
        this.recordCacheHit(key, CacheLevel.REDIS);
        return redisResult;
      }

      this.recordCacheMiss(key);
      return null;
    } catch (error) {
      this.logger.error('缓存读取失败', error as Error);
      this.metrics.increment('cache_errors');
      return null;
    } finally {
      timer.end();
    }
  }

  /**
   * 设置缓存数据
   */
  public async set<T>(key: string, value: T, options?: CacheConfig): Promise<void> {
    const timer = this.metrics.startTimer('cache_set');
    try {
      // 并行写入内存和Redis缓存
      await Promise.all([
        this.setInMemory(key, value, options),
        this.setInRedis(key, value, options),
      ]);

      this.updateCacheStats(key, value);
    } catch (error) {
      this.logger.error('缓存写入失败', error as Error);
      this.metrics.increment('cache_errors');
    } finally {
      timer.end();
    }
  }

  /**
   * 删除缓存数据
   */
  public async delete(key: string): Promise<void> {
    const timer = this.metrics.startTimer('cache_delete');
    try {
      // 并行删除内存和Redis缓存
      await Promise.all([this.memoryCache.delete(key), this.redis.del(key)]);

      this.cacheStats.delete(key);
      this.metrics.decrement('cache_memory_items');
    } catch (error) {
      this.logger.error('缓存删除失败', error as Error);
      this.metrics.increment('cache_errors');
    } finally {
      timer.end();
    }
  }

  /**
   * 清空所有缓存
   */
  public async clear(): Promise<void> {
    const timer = this.metrics.startTimer('cache_clear');
    try {
      // 并行清空内存和Redis缓存
      await Promise.all([this.memoryCache.clear(), this.redis.flushall()]);

      this.cacheStats.clear();
      this.metrics.set('cache_memory_items', 0);
      this.metrics.set('cache_memory_size', 0);
    } catch (error) {
      this.logger.error('缓存清空失败', error as Error);
      this.metrics.increment('cache_errors');
    } finally {
      timer.end();
    }
  }

  /**
   * 从内存缓存获取数据
   */
  private async getFromMemory<T>(key: string): Promise<T | null> {
    try {
      return await this.memoryCache.get<T>(key);
    } catch (error) {
      this.logger.error('内存缓存读取失败', error as Error);
      return null;
    }
  }

  /**
   * 从Redis缓存获取数据
   */
  private async getFromRedis<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error('Redis缓存读取失败', error as Error);
      return null;
    }
  }

  /**
   * 写入内存缓存
   */
  private async setInMemory<T>(key: string, value: T, options?: CacheConfig): Promise<void> {
    try {
      await this.memoryCache.set(key, value, options?.memoryTTL);
      this.metrics.increment('cache_memory_items');
      this.metrics.set('cache_memory_size', this.memoryCache.size);
    } catch (error) {
      this.logger.error('内存缓存写入失败', error as Error);
      throw error;
    }
  }

  /**
   * 写入Redis缓存
   */
  private async setInRedis<T>(key: string, value: T, options?: CacheConfig): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (options?.redisTTL) {
        await this.redis.setex(key, options.redisTTL, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      this.logger.error('Redis缓存写入失败', error as Error);
      throw error;
    }
  }

  /**
   * 记录缓存命中
   */
  private recordCacheHit(key: string, level: CacheLevel): void {
    this.metrics.increment('cache_hits');
    this.metrics.increment(`cache_hits_${level}`);

    const stats = this.getCacheStats(key);
    stats.hits++;
    stats.lastHit = Date.now();
    if (level === CacheLevel.MEMORY) {
      stats.memoryHits++;
    } else {
      stats.redisHits++;
    }
  }

  /**
   * 记录缓存未命中
   */
  private recordCacheMiss(key: string): void {
    this.metrics.increment('cache_misses');

    const stats = this.getCacheStats(key);
    stats.misses++;
    stats.lastMiss = Date.now();
  }

  /**
   * 获取缓存统计信息
   */
  private getCacheStats(key: string): CacheStats {
    let stats = this.cacheStats.get(key);
    if (!stats) {
      stats = {
        hits: 0,
        misses: 0,
        memoryHits: 0,
        redisHits: 0,
        lastHit: 0,
        lastMiss: 0,
        size: 0,
        createdAt: Date.now(),
      };
      this.cacheStats.set(key, stats);
    }
    return stats;
  }

  /**
   * 更新缓存统计信息
   */
  private updateCacheStats<T>(key: string, value: T): void {
    const stats = this.getCacheStats(key);
    stats.size = this.calculateSize(value);
    this.cacheStats.set(key, stats);
  }

  /**
   * 计算数据大小
   */
  private calculateSize(value: any): number {
    try {
      const serialized = JSON.stringify(value);
      return serialized.length * 2; // 假设使用UTF-16编码
    } catch {
      return 0;
    }
  }

  /**
   * 获取缓存统计信息
   */
  public async getStats(): Promise<{
    memory: {
      size: number;
      items: number;
      hitRate: number;
    };
    redis: {
      size: number;
      hitRate: number;
    };
    overall: {
      hitRate: number;
      missRate: number;
    };
  }> {
    const memorySize = this.memoryCache.size;
    const memoryItems = this.memoryCache.count;

    let totalHits = 0;
    let totalMemoryHits = 0;
    let totalRedisHits = 0;
    let totalMisses = 0;

    this.cacheStats.forEach(stats => {
      totalHits += stats.hits;
      totalMemoryHits += stats.memoryHits;
      totalRedisHits += stats.redisHits;
      totalMisses += stats.misses;
    });

    const total = totalHits + totalMisses;
    const hitRate = total > 0 ? totalHits / total : 0;
    const memoryHitRate = totalMemoryHits / (totalMemoryHits + totalRedisHits + totalMisses);
    const redisHitRate = totalRedisHits / (totalMemoryHits + totalRedisHits + totalMisses);

    return {
      memory: {
        size: memorySize,
        items: memoryItems,
        hitRate: memoryHitRate,
      },
      redis: {
        size: await this.getRedisSize(),
        hitRate: redisHitRate,
      },
      overall: {
        hitRate,
        missRate: 1 - hitRate,
      },
    };
  }

  /**
   * 获取Redis缓存大小
   */
  private async getRedisSize(): Promise<number> {
    try {
      const info = await this.redis.info('memory');
      const match = info.match(/used_memory:(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    } catch (error) {
      this.logger.error('获取Redis大小失败', error as Error);
      return 0;
    }
  }
}
