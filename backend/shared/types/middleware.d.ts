import { Request, Response, NextFunction } from 'express';

export interface IAuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkRole(role: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  checkPermission(
    permission: string,
  ): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface IRateLimitMiddleware {
  /** standard 的描述 */
  standard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  /** upload 的描述 */
  upload: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  /** api 的描述 */
  api: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface IValidationMiddleware {
  validateBody(schema: any): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  validateQuery(schema: any): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  validateParams(schema: any): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface IErrorHandlerMiddleware {
  (err: any, req: Request, res: Response, next: NextFunction): void;
}
