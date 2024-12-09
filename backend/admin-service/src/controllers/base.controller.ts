import { injectable, inject } from 'inversify';
import { Response } from 'express';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';

@injectable()
export abstract class BaseController {
  constructor(
    @inject(TYPES.Logger) protected logger: Logger
  ) {}

  protected handleSuccess(res: Response, data: any) {
    res.json({
      success: true,
      data
    });
  }

  protected handleError(res: Response, error: any) {
    this.logger.error('Controller error', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
} 