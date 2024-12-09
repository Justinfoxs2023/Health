import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

declare global {
  namespace Express {
    // 扩展Request接口
    interface Request extends ExpressRequest {
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
      query: ParsedQs;
      params: ParamsDictionary;
      headers: {
        authorization?: string;
        [key: string]: any;
      };
    }

    // 扩展Response接口
    interface Response extends ExpressResponse {
      status(code: number): this;
      json(body: {
        code: number;
        data?: any;
        message?: string;
      }): this;
    }
  }
}

// 中间件类型
export interface RequestHandler {
  (req: Express.Request, res: Express.Response, next: NextFunction): Promise<void> | void;
}

export interface ErrorRequestHandler {
  (err: any, req: Express.Request, res: Express.Response, next: NextFunction): void;
}

export interface Middleware {
  (req: Express.Request, res: Express.Response, next: NextFunction): Promise<void> | void;
} 