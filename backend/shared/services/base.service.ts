import { AppError } from '../utils/errors';
import { Logger } from '../utils/logger';
import { Redis } from '../utils/redis';

export abstract class BaseService {
  protected logger: Logger;
  protected redis: Redis;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
    this.redis = new Redis();
  }

  abstract init(): Promise<void>;

  protected async validate(data: any, schema: any): Promise<boolean> {
    try {
      await schema.validateAsync(data);
      return true;
    } catch (error) {
      throw new AppError('VALIDATION_ERROR', 400, error.message);
    }
  }

  protected handleError(error: Error): never {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('INTERNAL_ERROR', 500, error.message);
  }
}
