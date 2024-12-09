import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { RedisService } from '../redis/redis.service';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

@Injectable()
export class RateLimiterService {
  private readonly configs: Map<string, RateLimitConfig> = new Map();

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService
  ) {
    this.loadConfigs();
  }

  private loadConfigs() {
    // 从配置加载限流规则
    const defaultConfig: RateLimitConfig = {
      windowMs: 60000, // 1分钟
      maxRequests: 100 // 最大请求数
    };

    this.configs.set('default', defaultConfig);
  }

  async isAllowed(serviceId: string, clientId: string): Promise<boolean> {
    const config = this.configs.get(serviceId) || this.configs.get('default')!;
    const key = `ratelimit:${serviceId}:${clientId}`;
    
    const currentWindow = Math.floor(Date.now() / config.windowMs);
    const windowKey = `${key}:${currentWindow}`;

    const count = await this.redis.incr(windowKey);
    if (count === 1) {
      await this.redis.expire(windowKey, Math.ceil(config.windowMs / 1000));
    }

    return count <= config.maxRequests;
  }

  async getRemainingRequests(serviceId: string, clientId: string): Promise<number> {
    const config = this.configs.get(serviceId) || this.configs.get('default')!;
    const key = `ratelimit:${serviceId}:${clientId}`;
    
    const currentWindow = Math.floor(Date.now() / config.windowMs);
    const windowKey = `${key}:${currentWindow}`;

    const count = await this.redis.get(windowKey);
    return config.maxRequests - (parseInt(count || '0'));
  }
} 