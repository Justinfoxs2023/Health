import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export abstract class BaseController {
  protected logger: Logger;

  constructor(controllerName: string) {
    this.logger = new Logger(controllerName);
  }

  protected success<T>(res: Response, data?: T, message?: string) {
    return res.status(200).json({
      code: 200,
      data,
      message
    });
  }

  protected created<T>(res: Response, data?: T, message?: string) {
    return res.status(201).json({
      code: 201,
      data,
      message
    });
  }

  protected error(res: Response, error: AppError | Error) {
    const status = error instanceof AppError ? error.status : 500;
    const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR';
    const message = error.message || '服务器错误';

    return res.status(status).json({
      code,
      message
    });
  }

  protected validate<T>(data: T, schema: any) {
    const { error, value } = schema.validate(data);
    if (error) {
      throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
    }
    return value;
  }
} 