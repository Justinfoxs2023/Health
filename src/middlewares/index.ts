import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { Express, Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function setupMiddlewares(app: Express): void {
  try {
    // 基本中间件
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(helmet());
    app.use(compression());

    // 日志中间件
    if (process.env.NODE_ENV !== 'test') {
      app.use(
        morgan('combined', {
          stream: {
            write: (message: string) => logger.info(message.trim()),
          },
        }),
      );
    }

    // 错误处理中间件
    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      logger.error('请求处理错误', err);
      res.status(err.status || 500).json({
        message: err.message || '服务器内部错误',
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
      });
    });

    // 404处理
    app.use((req: Request, res: Response) => {
      res.status(404).json({
        message: '未找到请求的资源',
      });
    });

    logger.info('中间件设置完成');
  } catch (error) {
    logger.error('中间件设置失败', error);
    throw error;
  }
}
