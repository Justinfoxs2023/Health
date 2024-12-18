import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

declare global {
  namespace Express {
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

    interface Response extends ExpressResponse {
      status(code: number): this;
      json(body: { code: number; data?: any; message?: string }): this;
    }
  }
}

export type RequestHandlerType = (
  req: Express.Request,
  res: Express.Response,
  next: NextFunction,
) => Promise<void> | void;

export type ErrorRequestHandlerType = (
  err: any,
  req: Express.Request,
  res: Express.Response,
  next: NextFunction,
) => void;

export type MiddlewareType = RequestHandlerType | ErrorRequestHandlerType;
