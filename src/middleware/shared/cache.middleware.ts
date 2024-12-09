import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger';
import { Redis } from '../../utils/redis';

export class CacheMiddleware {
  private logger: Logger;
  private redis: Redis;

  constructor() {
    this.logger = new Logger('Cache');
    this.redis = new Redis();
  }

  // 缓存响应数据
  cacheResponse(duration: number = 3600) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 生成缓存键
        const cacheKey = this.generateCacheKey(req);

        // 检查缓存
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return res.json(JSON.parse(cached));
        }

        // 保存原始json方法
        const originalJson = res.json;

        // 重写json方法
        res.json = function(data: any): Response {
          // 存储缓存
          this.redis.setex(cacheKey, duration, JSON.stringify(data));
          
          // 调用原始json方法
          return originalJson.call(this, data);
        };

        next();
      } catch (error) {
        this.logger.error('缓存操作失败', error);
        next();
      }
    };
  }

  // 生成缓存键
  private generateCacheKey(req: Request): string {
    return `cache:${req.method}:${req.path}:${JSON.stringify(req.query)}`;
  }
}

export const cache = new CacheMiddleware(); 