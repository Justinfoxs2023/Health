import { AppError } from '../utils/errors';
import { ILogger } from '../types/logger';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class ErrorHandlerMiddleware {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}

  handle(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof AppError) {
      return res.status(error.status).json(error.toJSON());
    }

    // 未知错误
    this.logger.error('Unhandled Error:', error);
    return res.status(500).json({
      code: 'INTERNAL_ERROR',
      status: 500,
      message: '服务器内部错误',
    });
  }
}
