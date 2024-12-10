import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ErrorMonitor } from '../utils/error-monitor';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      next();
    } catch (error) {
      ErrorMonitor.logError(error, 'API错误');
      
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({
          code: error.getStatus(),
          message: error.message
        });
      } else {
        res.status(500).json({
          code: 500,
          message: '服务器内部错误'
        });
      }
    }
  }
} 