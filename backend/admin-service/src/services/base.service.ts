import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';

@injectable()
export abstract class BaseService {
  constructor(
    @inject(TYPES.Logger) protected readonly logger: Logger
  ) {}

  protected handleError(error: Error, message: string): never {
    this.logger.error(message, error);
    throw error;
  }
} 