import { Request, Response, NextFunction } from 'express';

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

export interface ITypedRequest<T = any> extends Request {
  /** body 的描述 */
  body: T;
}

export interface ITypedResponse<T = any> extends Response {
  /** json 的描述 */
  json: (body: T) => ITypedResponse<T>;
}

export type AsyncRequestHandlerType<T = any, U = any> = (
  req: ITypedRequest<T>,
  res: ITypedResponse<U>,
  next: NextFunction,
) => Promise<void>;
