import { Logger } from '../../utils/logger';
import { Request, Response, NextFunction } from 'express';

export class ErrorHandler {
  constructor(private logger: Logger) {}

  middleware() {
    return (error: Error, req: Request, res: Response, next: NextFunction) => {
      this.logger.error('API错误:', error);

      const response = {
        success: false,
        message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : error.message,
        errors:
          process.env.NODE_ENV === 'production'
            ? undefined
            : [
                {
                  type: error.name,
                  stack: error.stack,
                },
              ],
        meta: {
          timestamp: Date.now(),
          path: req.path,
        },
      };

      res.status(500).json(response);
    };
  }
}
