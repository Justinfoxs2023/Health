import { Request, Response, NextFunction } from 'express';

export interface IAuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkRole(role: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface IRateLimitMiddleware {
  standard(req: Request, res: Response, next: NextFunction): Promise<void>;
  upload(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IValidationMiddleware {
  validateBody(schema: any): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  validateQuery(schema: any): (req: Request, res: Response, next: NextFunction) => Promise<void>;
} 