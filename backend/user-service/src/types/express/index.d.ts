import { Request as ExpressRequest, Response } from 'express';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      user?: {
        id: string;
        roles: string[];
        permissions?: string[];
      };
      headers: {
        authorization?: string;
        [key: string]: string | string[] | undefined;
      };
      body: any;
      query: any;
    }

    interface Response {
      status(code: number): this;
      json(body: { code: number; data?: any; message?: string }): this;
    }
  }
}

export interface INextFunction {
  (err?: any): void;
}
