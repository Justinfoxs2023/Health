import { BaseService } from '../services/base.service';
import { Logger } from '../utils/logger';
import { Request, Response } from 'express';

export abstract class BaseController {
  protected service: BaseService;
  protected logger: Logger;

  constructor(service: BaseService) {
    this.service = service;
    this.logger = new Logger(this.constructor.name);
  }

  protected async handleRequest(req: Request, handler: () => Promise<any>): Promise<Response> {
    try {
      const result = await handler();
      return this.success(result);
    } catch (error) {
      return this.error(error);
    }
  }

  protected success(data?: any, message?: string) {
    return {
      code: 200,
      data,
      message,
    };
  }

  protected error(error: any) {
    return {
      code: error.status || 500,
      message: error.message || '服务器错误',
    };
  }
}
