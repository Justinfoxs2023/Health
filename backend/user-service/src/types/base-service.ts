import { Logger } from '../utils/logger';
import { Redis } from '../utils/redis';

export interface BaseServiceInterface {
  logger: Logger;
  redis: Redis;
}

export class BaseService implements BaseServiceInterface {
  protected logger: Logger;
  protected redis: Redis;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
    this.redis = new Redis();
  }
} 