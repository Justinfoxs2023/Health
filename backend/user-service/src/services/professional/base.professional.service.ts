import { AppError } from '../../utils/errors';
import { ILogger } from '../../types/logger';
import { IRedisClient } from '../../infrastructure/redis/types';
import { TYPES } from '../../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class BaseProfessionalService {
  constructor(
    @inject(TYPES.Logger) protected logger: ILogger,
    @inject(TYPES.Redis) protected redis: IRedisClient,
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
