import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';
import { AppError } from '../utils/errors';

@injectable()
export class ErrorHandlerMiddleware {
  constructor(@inject(TYPES.Logger) private logger: Logger) {}

  handle(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof AppError) {
      return res.status(error.status).json(error.toJSON());
    }

    // 未知错误
    this.logger.error('Unhandled Error:', error);
    return res.status(500).json({
      code: 'INTERNAL_ERROR',
      status: 500,
      message: '服务器内部错误'
    });
  }
} 