import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger';
import { ValidationError } from '../../types/shared';
import * as Joi from 'joi';

export class ValidationMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('Validation');
  }

  // 验证请求数据
  validateRequest(schema: Joi.Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 合并请求数据
        const data = {
          ...req.body,
          ...req.query,
          ...req.params
        };

        // 执行验证
        await schema.validateAsync(data, {
          abortEarly: false,
          stripUnknown: true
        });

        next();
      } catch (error) {
        if (error instanceof Joi.ValidationError) {
          const validationError = new ValidationError(
            '请求数据验证失败',
            error.details
          );
          next(validationError);
        } else {
          next(error);
        }
      }
    };
  }
}

export const validation = new ValidationMiddleware(); 