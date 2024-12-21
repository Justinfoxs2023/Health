import { Request } from 'express';

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
  }
}

export interface ITypedRequest<T = any> extends Request {
  /** body 的描述 */
  body: T;
  /** query 的描述 */
  query: any;
  /** params 的描述 */
  params: any;
}
