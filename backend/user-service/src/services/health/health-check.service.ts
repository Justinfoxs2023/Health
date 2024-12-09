import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Logger } from '../../types/logger';
import { RedisClient } from '../../infrastructure/redis/types';
import { HealthStatus, ServiceStatus } from '../../types/health.types';

@injectable()
export class HealthCheckService {
  constructor(
    @inject(TYPES.Redis) private redis: RedisClient,
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  async checkHealth(): Promise<HealthStatus> {
    return {
      redis: await this.checkRedis(),
      api: await this.checkAPI(),
      timestamp: new Date()
    };
  }

  private async checkRedis(): Promise<ServiceStatus> {
    const start = Date.now();
    try {
      await this.redis.ping();
      return {
        status: 'healthy',
        latency: Date.now() - start
      };
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  private async checkAPI(): Promise<ServiceStatus> {
    const start = Date.now();
    try {
      // 这里可以添加API健康检查的具体实现
      // 例如检查数据库连接、外部服务等
      return {
        status: 'healthy',
        latency: Date.now() - start
      };
    } catch (error) {
      this.logger.error('API health check failed:', error);
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
} 