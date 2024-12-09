import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { ValidationError } from '../errors';

export class DataValidationMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('DataValidation');
  }

  validateHealthData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      
      // 基础验证
      if (!data || !data.userId || !data.metrics) {
        throw new ValidationError('缺少必要的健康数据字段');
      }
      
      // 数据类型验证
      this.validateMetrics(data.metrics);
      
      // 数据范围验证
      this.validateDataRanges(data.metrics);
      
      next();
    } catch (error) {
      this.logger.error('数据验证失败', error);
      res.status(400).json({ error: error.message });
    }
  }
} 