import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger';
import { BaseResponse } from '../../types/shared';

export class ResponseFormatterMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ResponseFormatter');
  }

  // 响应格式化
  formatResponse(req: Request, res: Response, next: NextFunction) {
    // 保存原始send方法
    const originalSend = res.json;

    // 重写json方法
    res.json = function(data: any): Response {
      // 格式化响应数据
      const formattedResponse: BaseResponse = {
        code: res.statusCode >= 400 ? res.statusCode : 200,
        data: data,
        message: data.message || 'success',
        timestamp: new Date()
      };

      // 调用原始send方法
      return originalSend.call(this, formattedResponse);
    };

    next();
  }
}

export const responseFormatter = new ResponseFormatterMiddleware(); 