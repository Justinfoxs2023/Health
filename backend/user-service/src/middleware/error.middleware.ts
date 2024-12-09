import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = new Logger('ErrorMiddleware');

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message
    });
  }

  // 处理验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: err.message
    });
  }

  // 处理MongoDB重复键错误
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    return res.status(409).json({
      code: 'DUPLICATE_ERROR',
      message: '数据已存在'
    });
  }

  // 处理未知错误
  return res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: '服务器内部错误'
  });
};

// 处理未捕获的Promise错误
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

// 处理未捕获的异常
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  // 给进程一些时间来处理剩余的请求后退出
  setTimeout(() => {
    process.exit(1);
  }, 1000);
}); 