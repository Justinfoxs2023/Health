import {
  ICacheConfig,
  ICachePattern,
  ICacheStats,
  ICacheEntry,
  ICacheOptimizationResult,
  ICachePreloadConfig,
  ICacheEvictionConfig,
  ICacheCompressionConfig,
  ICacheClusterConfig,
  ICacheMonitoringConfig,
} from './interfaces';
import { CacheManager } from './cache-manager.service';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
@Injectable()
export class CacheOptimizerService {
  private config: ICacheConfig;
  private patterns: ICachePattern[];
  private stats: Map<string, ICacheStats>;
  private monitoring: ICacheMonitoringConfig;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly cacheManager: CacheManager,
    private readonly eventBus: EventBus,
  ) {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // 加载配置
      this.config = this.configService.get<ICacheConfig>('redis.caching.default');
      this.patterns = Object.entries(this.configService.get('redis.caching.patterns')).map(
        ([pattern, config]) => ({ pattern, ...config }),
      );
      this.monitoring = this.configService.get<ICacheMonitoringConfig>('redis.monitoring');

      // 初始化统计信息
      this.stats = new Map();

      // 启动监控
      if (this.monitoring.enabled) {
        this.startMonitoring();
      }

      this.logger.log('缓存优化服务初始化成功');
    } catch (error) {
      this.logger.error('缓存优化服务初始化失败', error);
      throw error;
    }
  }

  async optimize(): Promise<ICacheOptimizationResult> {
    try {
      // 获取当前缓存统计信息
      const beforeStats = await this.collectStats();

      // 执行优化
      const recommendations = await this.analyzeAndOptimize();

      // 获取优化后的统计信息
      const afterStats = await this.collectStats();

      const result: ICacheOptimizationResult = {
        before: beforeStats,
        after: afterStats,
        recommendations,
      };

      // 发送优化完成事件
      await this.eventBus.emit('cache.optimized', result);

      return result;
    } catch (error) {
      this.logger.error('缓存优化失败', error);
      throw error;
    }
  }

  private async collectStats(): Promise<ICacheStats> {
    const info = await this.cacheManager.getStats();
    return {
      hits: info.keyspace_hits,
      misses: info.keyspace_misses,
      hitRate: info.keyspace_hits / (info.keyspace_hits + info.keyspace_misses),
      size: info.used_memory,
      memory: info.used_memory_peak,
      evictions: info.evicted_keys,
    };
  }

  private async analyzeAndOptimize(): Promise<any[]> {
    const recommendations = [];

    // 分析内存使用
    if (await this.shouldOptimizeMemory()) {
      recommendations.push(await this.optimizeMemory());
    }

    // 分析命中率
    if (await this.shouldOptimizeHitRate()) {
      recommendations.push(await this.optimizeHitRate());
    }

    // 分析过期策略
    if (await this.shouldOptimizeTTL()) {
      recommendations.push(await this.optimizeTTL());
    }

    return recommendations;
  }

  private async shouldOptimizeMemory(): Promise<boolean> {
    const stats = await this.collectStats();
    return stats.memory > this.config.maxSize * 0.8;
  }

  private async optimizeMemory(): Promise<any> {
    // 执行内存优化
    const evictionConfig: ICacheEvictionConfig = {
      strategy: 'lru',
      threshold: this.config.maxSize * 0.7,
      minAge: 300, // 5分钟
    };

    await this.evictCache(evictionConfig);

    return {
      type: 'evict',
      description: '执行LRU缓存淘汰',
      impact: {
        memory: -30,
        hitRate: -5,
      },
    };
  }

  private async shouldOptimizeHitRate(): Promise<boolean> {
    const stats = await this.collectStats();
    return stats.hitRate < 0.8;
  }

  private async optimizeHitRate(): Promise<any> {
    // 执行命中率优化
    const preloadConfig: ICachePreloadConfig = {
      patterns: this.patterns.map(p => p.pattern),
      strategy: 'popular',
      limit: 1000,
      concurrency: 5,
    };

    await this.preloadCache(preloadConfig);

    return {
      type: 'preload',
      description: '预加载热点数据',
      impact: {
        memory: 10,
        hitRate: 15,
      },
    };
  }

  private async shouldOptimizeTTL(): Promise<boolean> {
    // 分析TTL分布
    const keys = await this.cacheManager.keys('*');
    const ttls = await Promise.all(keys.map(key => this.cacheManager.ttl(key)));
    const avgTTL = ttls.reduce((a, b) => a + b, 0) / ttls.length;

    return avgTTL < 300; // 平均TTL小于5分钟
  }

  private async optimizeTTL(): Promise<any> {
    // 优化TTL策略
    const keys = await this.cacheManager.keys('*');
    for (const key of keys) {
      const ttl = await this.cacheManager.ttl(key);
      if (ttl < 300) {
        await this.cacheManager.expire(key, 300);
      }
    }

    return {
      type: 'ttl',
      description: '调整过期时间策略',
      impact: {
        memory: 0,
        hitRate: 10,
      },
    };
  }

  private async evictCache(config: ICacheEvictionConfig): Promise<void> {
    const keys = await this.cacheManager.keys('*');
    const entries: ICacheEntry[] = await Promise.all(
      keys.map(async key => ({
        key,
        value: await this.cacheManager.get(key),
        size: await this.getEntrySize(key),
        hits: await this.getEntryHits(key),
        lastAccessed: await this.getEntryLastAccessed(key),
        createdAt: await this.getEntryCreatedAt(key),
      })),
    );

    // 根据策略排序
    entries.sort((a, b) => {
      switch (config.strategy) {
        case 'lru':
          return a.lastAccessed.getTime() - b.lastAccessed.getTime();
        case 'lfu':
          return a.hits - b.hits;
        case 'ttl':
          return (a.expiresAt?.getTime() || 0) - (b.expiresAt?.getTime() || 0);
        case 'random':
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    // 淘汰数据直到内存使用低于阈值
    let currentSize = entries.reduce((sum, entry) => sum + entry.size, 0);
    for (const entry of entries) {
      if (currentSize <= config.threshold) break;
      await this.cacheManager.del(entry.key);
      currentSize -= entry.size;
    }
  }

  private async preloadCache(config: ICachePreloadConfig): Promise<void> {
    // 获取需要预加载的数据
    const keys = await this.getPreloadKeys(config);

    // 并发预加载
    const chunks = this.chunkArray(keys, config.concurrency);
    for (const chunk of chunks) {
      await Promise.all(chunk.map(key => this.loadData(key)));
    }
  }

  private async getPreloadKeys(config: ICachePreloadConfig): Promise<string[]> {
    const allKeys = [];
    for (const pattern of config.patterns) {
      const keys = await this.cacheManager.keys(pattern);
      allKeys.push(...keys);
    }

    switch (config.strategy) {
      case 'popular':
        return this.getPopularKeys(allKeys, config.limit);
      case 'recent':
        return this.getRecentKeys(allKeys, config.limit);
      case 'all':
        return allKeys.slice(0, config.limit);
      default:
        return [];
    }
  }

  private async getPopularKeys(keys: string[], limit: number): Promise<string[]> {
    const keyHits = await Promise.all(
      keys.map(async key => ({
        key,
        hits: await this.getEntryHits(key),
      })),
    );

    return keyHits
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit)
      .map(item => item.key);
  }

  private async getRecentKeys(keys: string[], limit: number): Promise<string[]> {
    const keyAccess = await Promise.all(
      keys.map(async key => ({
        key,
        lastAccessed: await this.getEntryLastAccessed(key),
      })),
    );

    return keyAccess
      .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
      .slice(0, limit)
      .map(item => item.key);
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private async loadData(key: string): Promise<void> {
    try {
      const value = await this.cacheManager.get(key);
      if (value) {
        await this.cacheManager.set(key, value);
      }
    } catch (error) {
      this.logger.error(`预加载数据失败: ${key}`, error);
    }
  }

  private startMonitoring(): void {
    setInterval(async () => {
      try {
        const stats = await this.collectStats();
        this.stats.set(new Date().toISOString(), stats);

        // 检查告警条件
        await this.checkAlerts(stats);

        // 清理过期统计数据
        this.cleanupStats();
      } catch (error) {
        this.logger.error('监控数据收集失败', error);
      }
    }, this.monitoring.interval * 1000);
  }

  private async checkAlerts(stats: ICacheStats): Promise<void> {
    for (const alert of this.monitoring.alerts) {
      const value = stats[alert.metric];
      if (value > alert.threshold) {
        await this.eventBus.emit('cache.alert', {
          metric: alert.metric,
          value,
          threshold: alert.threshold,
          timestamp: new Date(),
        });
      }
    }
  }

  private cleanupStats(): void {
    const now = Date.now();
    for (const [timestamp, _] of this.stats) {
      if (now - new Date(timestamp).getTime() > 24 * 60 * 60 * 1000) {
        this.stats.delete(timestamp);
      }
    }
  }

  // 辅助方法
  private async getEntrySize(key: string): Promise<number> {
    const value = await this.cacheManager.get(key);
    return value ? JSON.stringify(value).length : 0;
  }

  private async getEntryHits(key: string): Promise<number> {
    // 从Redis INFO命令获取命中次数
    return 0; // 需要实现
  }

  private async getEntryLastAccessed(key: string): Promise<Date> {
    // 从Redis OBJECT命令获取最后访问时间
    return new Date(); // 需要实现
  }

  private async getEntryCreatedAt(key: string): Promise<Date> {
    // 从Redis OBJECT命令获取创建时间
    return new Date(); // 需要实现
  }
}
