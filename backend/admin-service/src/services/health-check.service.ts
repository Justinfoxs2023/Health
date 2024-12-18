import { BaseService } from './base/base.service';
import { ConfigLoader } from '../config/config.loader';
import { ILogger } from '../types/logger';
import { IRedisClient } from '../infrastructure/redis';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class HealthCheckService extends BaseService {
  private config = ConfigLoader.getInstance();

  constructor(@inject(TYPES.Logger) logger: ILogger, @inject(TYPES.Redis) redis: IRedisClient) {
    super(logger, redis);
  }

  async checkHealth(): Promise<IHealthStatus> {
    try {
      const [redisStatus, dbStatus, servicesStatus] = await Promise.all([
        this.checkRedis(),
        this.checkDatabase(),
        this.checkServices(),
      ]);

      const isHealthy = redisStatus && dbStatus && servicesStatus;

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          redis: redisStatus ? 'up' : 'down',
          database: dbStatus ? 'up' : 'down',
          services: servicesStatus ? 'up' : 'down',
        },
        version: this.config.get('APP_VERSION', '1.0.0'),
      };
    } catch (error) {
      this.logger.error('健康检查失败', error);
      throw error;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      await this.redis.set('health:check', 'ok', 5);
      const result = await this.redis.get('health:check');
      return result === 'ok';
    } catch (error) {
      this.logger.error('Redis健康检查失败', error);
      return false;
    }
  }

  private async checkDatabase(): Promise<boolean> {
    // 实现数据库健康检查
    return true;
  }

  private async checkServices(): Promise<boolean> {
    // 实现微服务健康检查
    return true;
  }
}

interface IHealthStatus {
  /** status 的描述 */
  status: 'healthy' | 'unhealthy';
  /** timestamp 的描述 */
  timestamp: string;
  /** services 的描述 */
  services: {
    redis: 'up' | 'down';
    database: 'up' | 'down';
    services: 'up' | 'down';
  };
  /** version 的描述 */
  version: string;
}
