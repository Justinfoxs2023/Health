import { IUser } from './interfaces/user.interface';
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      user?: IUser;
      headers: {
        authorization?: string;
        [key: string]: string | string[] | undefined;
      };
      body: any;
      query: any;
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
