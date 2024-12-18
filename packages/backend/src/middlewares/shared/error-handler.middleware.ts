import { AppError } from '../../types/shared';
import { Logger } from '../../utils/logger';
import { Request, Response, NextFunction } from 'express';

export class ErrorHandlerMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ErrorHandler');
  }

  // 错误处理中间件
  handleError(error: AppError, req: Request, res: Response, next: NextFunction) {
    try {
      // 记录错误
      this.logger.error('应用错误', {
        error,
        path: req.path,
        method: req.method,
        query: req.query,
        body: req.body,
      });

      // 格式化错误响应
      const response = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || '服务器错误',
        details: error.details,
        timestamp: new Date(),
      };

      // 发送错误响应
      res.status(error.status || 500).json(response);
    } catch (err) {
      this.logger.error('错误处理失败', err);
      res.status(500).json({
        code: 'ERROR_HANDLER_FAILED',
        message: '服务器错误',
        timestamp: new Date(),
      });
    }
  }
}

export const errorHandler = new ErrorHandlerMiddleware();
