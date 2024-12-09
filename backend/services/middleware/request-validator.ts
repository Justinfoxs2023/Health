import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Logger } from '../../utils/logger';

export class RequestValidator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('RequestValidator');
  }

  validate(dto: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 将请求数据转换为DTO类实例
        const dtoObject = plainToClass(dto, {
          ...req.body,
          ...req.query,
          ...req.params
        });

        // 验证DTO对象
        const errors = await validate(dtoObject, {
          whitelist: true,
          forbidNonWhitelisted: true
        });

        if (errors.length > 0) {
          return res.status(400).json({
            success: false,
            message: '请求参数验证失败',
            errors: this.formatErrors(errors),
            meta: {
              timestamp: Date.now(),
              path: req.path
            }
          });
        }

        // 将验证后的DTO对象添加到请求中
        req.body = dtoObject;
        next();
      } catch (error) {
        this.logger.error('请求验证失败:', error);
        next(error);
      }
    };
  }

  private formatErrors(errors: ValidationError[]): any[] {
    return errors.map(error => ({
      field: error.property,
      constraints: error.constraints,
      children: error.children?.length ? this.formatErrors(error.children) : undefined
    }));
  }
} 