import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { Logger } from '../utils/logger';

export const errorHandler = (logger: Logger) => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error occurred:', err);

    if (err instanceof AppError) {
      return res.status(err.status).json({
        code: err.code,
        message: err.message,
        data: err.data
      });
    }

    // 处理验证错误
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: err.message
      });
    }

    // 处理未知错误
    return res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    });
  };
}; 