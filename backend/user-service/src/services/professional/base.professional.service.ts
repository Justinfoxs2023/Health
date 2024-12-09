import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Logger } from '../../types/logger';
import { RedisClient } from '../../infrastructure/redis/types';
import { AppError } from '../../utils/errors';

@injectable()
export class BaseProfessionalService {
  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Redis) protected redis: RedisClient
  ) {}

  protected async validateProfessionalAccess(userId: string, role: string): Promise<void> {
    const cacheKey = `professional:${userId}:${role}`;
    const cached = await this.redis.get(cacheKey);

    if (!cached) {
      throw new AppError('UNAUTHORIZED', 403, '未经授权的专业角色访问');
    }
  }

  protected async validateClientAccess(professionalId: string, clientId: string): Promise<void> {
    const cacheKey = `professional:${professionalId}:clients`;
    const clients = await this.redis.smembers(cacheKey);

    if (!clients.includes(clientId)) {
      throw new AppError('FORBIDDEN', 403, '无权访问该客户信息');
    }
  }
} 