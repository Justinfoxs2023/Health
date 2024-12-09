export * from './base.error';

export class ValidationError extends AppError {
  constructor(message: string, details?: ValidationErrorDetail[]) {
    super('VALIDATION_ERROR', 400, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权访问') {
    super('UNAUTHORIZED', 401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = '权限不足') {
    super('FORBIDDEN', 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', 404, `${resource}不存在`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', 409, message);
  }
}

export class InternalError extends AppError {
  constructor(message: string = '服务器内部错误') {
    super('INTERNAL_ERROR', 500, message);
  }
} 