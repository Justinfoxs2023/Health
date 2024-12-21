import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { SystemEvents, EventSource, EventPriority } from '../communication/events';
import { createClient, RedisClientType } from 'redis';
import { injectable, inject } from 'inversify';

export interface ICacheOptions {
  /** url 的描述 */
    url: string;
  /** defaultTTL 的描述 */
    defaultTTL: number;
  /** maxMemoryMB 的描述 */
    maxMemoryMB: number;
  /** maxKeys 的描述 */
    maxKeys: number;
  /** evictionPolicy 的描述 */
    evictionPolicy: lru  lfu  random;
}

/**
 * 缓存管理器
 */
@injectable()
export class CacheManager {
  private client: RedisClientType;
  private options: ICacheOptions;
  private hits = 0;
  private misses = 0;
  private isInitialized = false;

  constructor(
    @inject() private logger: Logger,
    @inject() private metrics: MetricsCollector,
    @inject() private eventBus: EventBus,
  ) {}

  /**
   * 初始化缓存
   */
  public async initialize(options: ICacheOptions): Promise<void> {
    this.options = {
      defaultTTL: 3600,
      maxMemoryMB: 512,
      maxKeys: 1000000,
      evictionPolicy: 'lru',
      ...options,
    };

    try {
      this.client = createClient({
        url: this.options.url,
      });

      await this.client.connect();

      // 配置Redis
      await this.configureRedis();

      this.isInitialized = true;
      this.logger.info('缓存管理器初始化成功');

      // 启动监控
      this.startMonitoring();
    } catch (error) {
      this.logger.error('缓存管理器初始化失败', error);
      throw error;
    }
  }

  /**
   * 配置Redis
   */
  private async configureRedis(): Promise<void> {
    await this.client.configSet('maxmemory', `${this.options.maxMemoryMB}mb`);
    await this.client.configSet('maxmemory-policy', this.getEvictionPolicy());
  }

  /**
   * 获取驱逐策略
   */
  private getEvictionPolicy(): string {
    switch (this.options.evictionPolicy) {
      case 'lru':
        return 'allkeys-lru';
      case 'lfu':
        return 'allkeys-lfu';
      case 'random':
        return 'allkeys-random';
      default:
        return 'allkeys-lru';
    }
  }

  /**
   * 启动监控
   */
  private startMonitoring(): void {
    setInterval(async () => {
      try {
        const info = await this.client.info('memory');
        const stats = this.parseRedisInfo(info);

        this.metrics.gauge(`${this.constructor.name}.memory.used`, stats.used_memory);
        this.metrics.gauge(`${this.constructor.name}.memory.peak`, stats.used_memory_peak);
        this.metrics.gauge(`${this.constructor.name}.keys.total`, await this.client.dbSize());

        if (stats.used_memory > this.options.maxMemoryMB! * 1024 * 1024 * 0.9) {
          this.eventBus.publish(
            SystemEvents.WARNING,
            {
              service: this.constructor.name,
              message: 'Cache memory usage is high',
              details: stats,
            },
            {
              source: EventSource.SERVICE,
              priority: EventPriority.HIGH,
            },
          );
        }
      } catch (error) {
        this.logger.error('缓存监控失败', error);
      }
    }, 60000); // 每分钟监控一次
  }

  /**
   * 解析Redis信息
   */
  private parseRedisInfo(info: string): Record<string, number> {
    const stats: Record<string, number> = {};
    const lines = info.split('\n');

    for (const line of lines) {
      if (line.startsWith('used_memory:')) {
        stats.used_memory = parseInt(line.split(':')[1]);
      } else if (line.startsWith('used_memory_peak:')) {
        stats.used_memory_peak = parseInt(line.split(':')[1]);
      }
    }

    return stats;
  }

  /**
   * 获取缓存值
   */
  public async get<T>(key: string): Promise<T | null> {
    if (!this.isInitialized) {
      throw new Error('缓存管理器未初始化');
    }

    try {
      const value = await this.client.get(key);
      if (value === null) {
        this.misses++;
        this.metrics.increment(`${this.constructor.name}.miss`);
        return null;
      }

      this.hits++;
      this.metrics.increment(`${this.constructor.name}.hit`);
      return JSON.parse(value);
    } catch (error) {
      this.logger.error(`获取缓存失败: ${key}`, error);
      throw error;
    }
  }

  /**
   * 设置缓存值
   */
  public async set<T>(
    key: string,
    value: T,
    ttl: number = this.options.defaultTTL!,
  ): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('缓存管理器未初始化');
    }

    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: ttl,
      });
      this.metrics.increment(`${this.constructor.name}.set`);
    } catch (error) {
      this.logger.error(`设置缓存失败: ${key}`, error);
      throw error;
    }
  }

  /**
   * 删除缓存值
   */
  public async delete(key: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('缓存管理器未初始化');
    }

    try {
      await this.client.del(key);
      this.metrics.increment(`${this.constructor.name}.delete`);
    } catch (error) {
      this.logger.error(`删除缓存失败: ${key}`, error);
      throw error;
    }
  }

  /**
   * 使用模式删除缓存
   */
  public async deletePattern(pattern: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('缓存管理器未初始化');
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        this.metrics.increment(`${this.constructor.name}.delete_pattern`, keys.length);
      }
    } catch (error) {
      this.logger.error(`模式删除缓存失败: ${pattern}`, error);
      throw error;
    }
  }

  /**
   * 清空缓存
   */
  public async clear(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('缓存管理器未初始化');
    }

    try {
      await this.client.flushDb();
      this.metrics.increment(`${this.constructor.name}.clear`);
    } catch (error) {
      this.logger.error('清空缓存失败', error);
      throw error;
    }
  }

  /**
   * 获取缓存大小
   */
  public async getSize(): Promise<number> {
    if (!this.isInitialized) {
      throw new Error('缓存管理器未初始化');
    }

    try {
      return await this.client.dbSize();
    } catch (error) {
      this.logger.error('获取缓存大小失败', error);
      throw error;
    }
  }

  /**
   * 获取缓存命中率
   */
  public getHitRate(): number {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : (this.hits / total) * 100;
  }

  /**
   * 健康检查
   */
  public async ping(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('缓存管理器未初始化');
    }

    try {
      await this.client.ping();
    } catch (error) {
      this.logger.error('缓存健康检查失败', error);
      throw error;
    }
  }

  /**
   * 关闭缓存
   */
  public async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      await this.client.quit();
      this.isInitialized = false;
      this.logger.info('缓存管理器已关闭');
    } catch (error) {
      this.logger.error('关闭缓存管理器失败', error);
      throw error;
    }
  }

  /**
   * 获取缓存状态
   */
  public async getStatus(): Promise<Record<string, any>> {
    if (!this.isInitialized) {
      throw new Error('缓存管理器未初始化');
    }

    try {
      const info = await this.client.info();
      const stats = this.parseRedisInfo(info);

      return {
        ...stats,
        hitRate: this.getHitRate(),
        totalKeys: await this.getSize(),
        isInitialized: this.isInitialized,
      };
    } catch (error) {
      this.logger.error('获取缓存状态失败', error);
      throw error;
    }
  }
}
