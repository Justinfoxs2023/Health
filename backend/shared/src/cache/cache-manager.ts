import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';
import { RedisClient } from '../infrastructure/redis';

@injectable()
export class CacheManager {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.Redis) private readonly redis: RedisClient
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`缓存读取失败: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), ttl);
    } catch (error) {
      this.logger.error(`缓存写入失败: ${key}`, error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      this.logger.error(`缓存清理失败: ${pattern}`, error);
    }
  }
} 