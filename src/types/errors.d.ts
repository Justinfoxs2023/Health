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