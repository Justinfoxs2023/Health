import { Request, Response, NextFunction } from 'express';

export interface AuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkRole(role: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  checkPermission(permission: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface RateLimitMiddleware {
  standard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  upload: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  api: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface ValidationMiddleware {
  validateBody(schema: any): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  validateQuery(schema: any): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  validateParams(schema: any): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface ErrorHandlerMiddleware {
  (err: any, req: Request, res: Response, next: NextFunction): void;
} 