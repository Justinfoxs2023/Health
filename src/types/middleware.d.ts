import { Request, Response, NextFunction } from 'express';

declare module '../middleware/*' {
  export interface AuthMiddleware {
    verifyTokenreq: Request, res: Response, next: NextFunction: Promisevoid;
  }

  export interface RateLimitMiddleware {
    standardreq: Request, res: Response, next: NextFunction: Promisevoid;
    uploadreq: Request, res: Response, next: NextFunction: Promisevoid;
  }
}

// Express扩展
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        roles: string;
        permissions: string;
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
