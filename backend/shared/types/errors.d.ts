/**
 * @fileoverview TS 文件 errors.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 基础错误类型
export class AppError extends Error {
  constructor(public code: string, public status: number, message: string, public data?: any) {
    super(message);
    this.name = this.constructor.name;
  }
}

// 业务错误类型
export class UserNotFoundError extends AppError {
  constructor() {
    super('USER_NOT_FOUND', 404, '用户不存在');
  }
}

export class ProfileNotFoundError extends AppError {
  constructor() {
    super('PROFILE_NOT_FOUND', 404, '用户画像不存在');
  }
}

export class ValidationError extends AppError {
  constructor(details: any) {
    super('VALIDATION_ERROR', 400, '验证失败', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super('AUTH_ERROR', 401, message);
  }
}

export class PermissionError extends AppError {
  constructor(message: string) {
    super('PERMISSION_ERROR', 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', 404, `${resource}不存在`);
  }
}

// 错误处理器类型
export interface IErrorHandler {
  (err: Error, req: Express.Request, res: Express.Response, next: NextFunction): void;
}
