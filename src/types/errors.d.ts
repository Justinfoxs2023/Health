/**
 * @fileoverview TS 文件 errors.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '../utils/errors' {
  export class BaseError extends Error {
    constructor(message: string);
    code: string;
    status: number;
  }

  export class ValidationError extends BaseError {}
  export class AuthenticationError extends BaseError {}
  export class AuthorizationError extends BaseError {}
  export class NotFoundError extends BaseError {}
  export class SecurityError extends BaseError {}
  export class UserNotFoundError extends NotFoundError {}
  export class ProfileNotFoundError extends NotFoundError {}
  export class PermissionError extends AuthorizationError {}
  export class AppError extends BaseError {}
}
