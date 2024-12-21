import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

declare global {
  namespace Express {
    export interface Request extends ExpressRequest {
      user?: {
        id: string;
        roles: string[];
        permissions?: string[];
      };
      body: any;
      query: any;
      params: any;
      headers: {
        authorization?: string;
        [key: string]: any;
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

    export interface Response extends ExpressResponse {
      status(code: number): this;
      json(body: { code: number; data?: any; message?: string }): this;
    }
  }
}
