import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<void> | void;
}

export interface IRateLimitMiddleware {
  standard: IMiddleware;
  upload: IMiddleware;
  api: IMiddleware;
}

export interface IAuthMiddleware {
  verifyToken: IMiddleware;
  checkRole(role: string): IMiddleware;
  checkPermission(permission: string): IMiddleware;
}

export interface IValidationMiddleware {
  validateBody(schema: any): IMiddleware;
  validateQuery(schema: any): IMiddleware;
  validateParams(schema: any): IMiddleware;
}

export interface IErrorMiddleware {
  handle(err: Error, req: Request, res: Response, next: NextFunction): void;
} 