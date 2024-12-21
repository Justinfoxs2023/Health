import { Logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

const logger = new Logger('ErrorMiddleware');

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error('API Error:', error);

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : error.message,
  });
};
