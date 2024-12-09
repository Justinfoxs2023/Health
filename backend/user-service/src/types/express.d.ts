import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { User } from './interfaces/user.interface';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      user?: User;
      headers: {
        authorization?: string;
        [key: string]: string | string[] | undefined;
      };
      body: any;
      query: any;
    }

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

export type RequestHandler = (
  req: Express.Request,
  res: Express.Response,
  next: NextFunction
) => Promise<void> | void; 