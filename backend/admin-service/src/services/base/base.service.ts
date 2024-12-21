import { ILogger } from '../../types/logger';
import { IRedisClient } from '../../infrastructure/redis';
import { TYPES } from '../../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export abstract class BaseService {
  constructor(
    @inject(TYPES.Logger) protected logger: ILogger,
    @inject(TYPES.Redis) protected redis: IRedisClient,
  ) {}

  protected async handleError(error: any, message: string): Promise<never> {
    this.logger.error(message, error);
    throw error;
  }

  protected async cacheGet<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`缓存读取失败: ${key}`, error);
      return null;
    }
  }

  protected async cacheSet<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), ttl);
    } catch (error) {
      this.logger.error(`缓存写入失败: ${key}`, error);
    }
  }
}
