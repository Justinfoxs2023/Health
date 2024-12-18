import { Request, Response, NextFunction } from 'express';

// 认证中间件类型
export interface IAuthMiddleware {
  /** verifyTokenreq 的描述 */
    verifyTokenreq: Request, /** res 的描述 */
    /** res 的描述 */
    res: Response, /** next 的描述 */
    /** next 的描述 */
    next: NextFunction: /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;
  /** checkRolerole 的描述 */
    checkRolerole: string: /** req 的描述 */
    /** req 的描述 */
    req: Request, /** res 的描述 */
    /** res 的描述 */
    res: Response, /** next 的描述 */
    /** next 的描述 */
    next: NextFunction  /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;
}

// 速率限制中间件类型
export interface IRateLimitMiddleware {
  /** standardreq 的描述 */
    standardreq: Request, /** res 的描述 */
    /** res 的描述 */
    res: Response, /** next 的描述 */
    /** next 的描述 */
    next: NextFunction: /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;
  /** uploadreq 的描述 */
    uploadreq: Request, /** res 的描述 */
    /** res 的描述 */
    res: Response, /** next 的描述 */
    /** next 的描述 */
    next: NextFunction: /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;
}

// 验证中间件类型
export interface IValidationMiddleware {
  /** validateBodyschema 的描述 */
    validateBodyschema: any: /** req 的描述 */
    /** req 的描述 */
    req: Request, /** res 的描述 */
    /** res 的描述 */
    res: Response, /** next 的描述 */
    /** next 的描述 */
    next: NextFunction  /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;
  /** validateQueryschema 的描述 */
    validateQueryschema: any: /** req 的描述 */
    /** req 的描述 */
    req: Request, /** res 的描述 */
    /** res 的描述 */
    res: Response, /** next 的描述 */
    /** next 的描述 */
    next: NextFunction  /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;
}
