import { ErrorCodeType } from '../../types/error.types';

export class AppError extends Error {
  constructor(
    public code: ErrorCodeType,
    public status: number,
    message: string,
    public details?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      status: this.status,
      message: this.message,
      details: this.details,
    };
  }
}
