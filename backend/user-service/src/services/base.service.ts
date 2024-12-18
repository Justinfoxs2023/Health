import { Logger } from '../utils/logger';
import { Redis } from '../utils/redis';

export class BaseService {
  protected redis: Redis;
  protected logger: Logger;

  constructor(serviceName: string) {
    this.redis = new Redis();
    this.logger = new Logger(serviceName);
  }

  protected async cacheGet<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error('Cache get error', error);
      return null;
    }
  }

  protected async cacheSet(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const data = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, data);
      } else {
        await this.redis.set(key, data);
      }
    } catch (error) {
      this.logger.error('Cache set error', error);
    }
  }
}
