import { Logger } from '../../utils/logger';
import { Redis } from '../../utils/redis';

export class HealthCacheService {
  private redis: Redis;
  private logger: Logger;

  constructor() {
    this.redis = new Redis();
    this.logger = new Logger('HealthCache');
  }

  async cacheAnalysisResult(key: string, data: any, ttl = 3600) {
    try {
      const cacheKey = `analysis:${key}`;
      await this.redis.setex(cacheKey, ttl, JSON.stringify(data));
    } catch (error) {
      this.logger.error('缓存分析结果失败', error);
      throw error;
    }
  }

  async getAnalysisFromCache(key: string): Promise<any | null> {
    try {
      const cacheKey = `analysis:${key}`;
      const cached = await this.redis.get(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      this.logger.error('获取缓存分析失败', error);
      return null;
    }
  }
}
