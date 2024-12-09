import { Request, Response, NextFunction } from 'express';

declare module '../middleware/*' {
  export interface AuthMiddleware {
    verifyToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  }

  export interface RateLimitMiddleware {
    standard(req: Request, res: Response, next: NextFunction): Promise<void>;
    upload(req: Request, res: Response, next: NextFunction): Promise<void>;
  }
}

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
    }
  }
} 