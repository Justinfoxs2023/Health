import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Logger } from '../../types/logger';
import { AppError, InternalError } from '../../utils/errors';

@injectable()
export class ErrorHandlingService {
  constructor(@inject(TYPES.Logger) private logger: Logger) {}

  handleError(error: Error, context: string): never {
    if (error instanceof AppError) {
      this.logger.error(`[${context}] ${error.code}:`, {
        message: error.message,
        details: error.details,
        stack: error.stack
      });
      throw error;
    }

    // 未知错误转换为内部错误
    this.logger.error(`[${context}] INTERNAL_ERROR:`, {
      message: error.message,
      stack: error.stack
    });
    throw new InternalError(error.message);
  }

  handleValidationError(error: Error, context: string): never {
    this.logger.warn(`[${context}] Validation Error:`, error);
    throw new ValidationError(error.message);
  }

  handleDatabaseError(error: Error, context: string): never {
    this.logger.error(`[${context}] Database Error:`, error);
    throw new InternalError('数据库操作失败');
  }

  handleAuthenticationError(error: Error, context: string): never {
    this.logger.warn(`[${context}] Authentication Error:`, error);
    throw new UnauthorizedError(error.message);
  }
} 