import { Redis } from '../../utils/redis';
import { Logger } from '../../utils/logger';
import { CacheConfig } from '../../types/cache';

export class AdvancedCacheService {
  private redis: Redis;
  private logger: Logger;

  constructor() {
    this.redis = new Redis();
    this.logger = new Logger('AdvancedCache');
  }

  // 分层缓存
  async getWithLayeredCache<T>(
    key: string,
    fetchData: () => Promise<T>,
    config: CacheConfig
  ): Promise<T> {
    try {
      // 1. 检查本地缓存
      const localCache = await this.getFromLocalCache(key);
      if (localCache) return localCache;

      // 2. 检查Redis缓存
      const redisCache = await this.getFromRedis(key);
      if (redisCache) {
        await this.setLocalCache(key, redisCache, config.localTTL);
        return redisCache;
      }

      // 3. 获取新数据
      const data = await fetchData();
      
      // 4. 更新缓存
      await Promise.all([
        this.setLocalCache(key, data, config.localTTL),
        this.setRedisCache(key, data, config.redisTTL)
      ]);

      return data;
    } catch (error) {
      this.logger.error('分层缓存操作失败', error);
      throw error;
    }
  }

  // 缓存预热
  async warmupCache(keys: string[]): Promise<void> {
    try {
      const warmupPromises = keys.map(async key => {
        const data = await this.fetchDataForKey(key);
        await this.setRedisCache(key, data, 3600);
      });

      await Promise.all(warmupPromises);
    } catch (error) {
      this.logger.error('缓存预热失败', error);
      throw error;
    }
  }
} 