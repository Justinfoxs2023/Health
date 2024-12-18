import 'reflect-metadata';
import { ILogger } from '../types/logger';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export abstract class BaseService {
  constructor(@inject(TYPES.Logger) protected readonly logger: ILogger) {}

  protected handleError(error: Error, message: string): never {
    this.logger.error(message, error);
    throw error;
  }
}
