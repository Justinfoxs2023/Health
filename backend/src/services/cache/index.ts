import Redis from 'ioredis';
import { logger } from '../logger';

class CacheService {
  private redis: Redis;
  private readonly defaultTTL = 3600; // 默认缓存1小时

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: 0,
      retryStrategy: times => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.redis.on('error', err => {
      logger.error('Redis连接错误:', err);
    });

    this.redis.on('connect', () => {
      logger.info('Redis连接成功');
    });
  }

  /**
   * 设置缓存
   */
  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(key, ttl, serializedValue);
    } catch (error) {
      logger.error('缓存设置失败:', { key, error });
      throw error;
    }
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('缓存获取失败:', { key, error });
      return null;
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('缓存删除失败:', { key, error });
      throw error;
    }
  }

  /**
   * 批量删除缓存
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error('批量缓存删除失败:', { pattern, error });
      throw error;
    }
  }

  /**
   * 缓存健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('缓存健康检查失败:', error);
      return false;
    }
  }

  /**
   * 获取缓存统计信息
   */
  async getStats(): Promise<any> {
    try {
      const info = await this.redis.info();
      return info;
    } catch (error) {
      logger.error('获取缓存统计信息失败:', error);
      throw error;
    }
  }

  /**
   * 清理所有缓存
   */
  async flush(): Promise<void> {
    try {
      await this.redis.flushdb();
    } catch (error) {
      logger.error('清理缓存失败:', error);
      throw error;
    }
  }

  /**
   * 关闭缓存连接
   */
  async close(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      logger.error('关闭缓存连接失败:', error);
      throw error;
    }
  }
}

export const cacheService = new CacheService();
