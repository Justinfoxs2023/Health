import { Logger } from '../utils/logger';
import { Redis } from 'ioredis';
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
      body: any;
      query: any;
      params: any;
      headers: {
        authorization?: string;
        [key: string]: any;
      };
    }

    interface Response {
      status(code: number): this;
      json(body: any): this;
    }
  }
}

// 基础服务接口
export interface IBaseService {
  /** logger 的描述 */
  logger: Logger;
  /** redis 的描述 */
  redis: Redis;
}

// 错误类型
export class AppError extends Error {
  status: number;
  code: string;
}
