import { Logger } from '../../utils/logger';
import { Cache } from '../../utils/cache';
import { Metrics } from '../../utils/metrics';
import { ServiceConfig } from '../../types/shared';

export abstract class BaseService {
  protected logger: Logger;
  protected cache: Cache;
  protected metrics: Metrics;
  protected config: ServiceConfig;

  constructor(name: string, config: ServiceConfig) {
    this.logger = new Logger(name);
    this.cache = new Cache();
    this.metrics = new Metrics();
    this.config = this.initConfig(config);
  }

  // 配置初始化
  protected initConfig(config: ServiceConfig): ServiceConfig {
    return {
      ...this.getDefaultConfig(),
      ...config
    };
  }

  // 获取默认配置
  protected abstract getDefaultConfig(): ServiceConfig;

  // 性能监控
  protected async measurePerformance<T>(
    operation: string,
    func: () => Promise<T>
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await func();
      const duration = Date.now() - start;
      
      this.metrics.recordTiming(operation, duration);
      return result;
    } catch (error) {
      this.metrics.incrementCounter(`${operation}_error`);
      throw error;
    }
  }

  // 缓存管理
  protected async withCache<T>(
    key: string,
    func: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.cache.get(key);
    if (cached) {
      return cached as T;
    }

    const data = await func();
    await this.cache.set(key, data, ttl);
    return data;
  }

  // 错误处理
  protected handleError(error: Error, context?: any): never {
    this.logger.error('Service error', { error, context });
    throw error;
  }
} 