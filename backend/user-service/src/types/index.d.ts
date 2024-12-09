import { Request, Response, NextFunction } from 'express';
import { Redis as IORedis } from 'ioredis';

// Express扩展
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
        permissions?: string[];
      };
      file?: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
      };
    }
  }
}

// Redis类型
export type Redis = IORedis;

// 错误类型
export interface AppError extends Error {
  status: number;
  code: string;
}

// 服务接口
export interface IBaseService {
  logger: Logger;
  redis: Redis;
}

// 中间件类型
export interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

// 验证器类型
export interface IValidator<T = any> {
  validate(data: T): ValidationResult;
}

export interface ValidationResult {
  error?: {
    details: Array<{
      message: string;
      path: string[];
    }>;
  };
  value: any;
} 