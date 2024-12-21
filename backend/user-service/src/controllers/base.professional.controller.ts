import { AppError } from '../utils/errors';
import { BaseController } from './base.controller';
import { Logger } from '../utils/logger';
import { Request, Response } from 'express';

export abstract class BaseProfessionalController extends BaseController {
  protected logger: Logger;

  constructor(controllerName: string) {
    super(controllerName);
    this.logger = new Logger(controllerName);
  }

  protected validateUser(req: Request): string {
    if (!req.user || !req.user.id) {
      throw new AppError('未授权访问', 401);
    }
    return req.user.id;
  }

  protected validateRequest(req: Request) {
    const userId = this.validateUser(req);
    const { page = 1, limit = 10 } = req.query;
    return {
      userId,
      page: Number(page),
      limit: Number(limit),
    };
  }

  protected handleError(res: Response, error: any, message: string) {
    this.logger.error(message, error);
    return this.error(res, error);
  }
}
