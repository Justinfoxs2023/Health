import { Logger } from '../utils/logger';
import { Redis } from '../utils/redis';

export interface IBaseServiceInterface {
  /** logger 的描述 */
  logger: Logger;
  /** redis 的描述 */
  redis: Redis;
}

export class BaseService implements IBaseServiceInterface {
  protected logger: Logger;
  protected redis: Redis;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
    this.redis = new Redis();
  }
}
