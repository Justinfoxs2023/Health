import { ILogger } from '../types/logger';
import { Response } from 'express';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export abstract class BaseController {
  constructor(@inject(TYPES.Logger) protected logger: ILogger) {}

  protected handleSuccess(res: Response, data: any) {
    res.json({
      success: true,
      data,
    });
  }

  protected handleError(res: Response, error: any) {
    this.logger.error('Controller error', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
