import { Redis as IORedis } from 'ioredis';
import { Request, Response, NextFunction } from 'express';

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
export type RedisType = IORedis;

// 错误类型
export interface IAppError extends Error {
  /** status 的描述 */
  status: number;
  /** code 的描述 */
  code: string;
}

// 服务接口
export interface IBaseService {
  /** logger 的描述 */
  logger: Logger;
  /** redis 的描述 */
  redis: RedisType;
}

// 中间件类型
export interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

// 验证器类型
export interface IValidator<T = any> {
  validate(data: T): IValidationResult;
}

export interface IValidationResult {
  /** error 的描述 */
  error?: {
    details: Array<{
      message: string;
      path: string[];
    }>;
  };
  /** value 的描述 */
  value: any;
}
