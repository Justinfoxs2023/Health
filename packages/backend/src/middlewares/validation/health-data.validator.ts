import { HealthDataSchema } from '../../schemas/health-data.schema';
import { Logger } from '../../utils/logger';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../errors';

export class HealthDataValidator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('HealthDataValidator');
  }

  // 验证健康数据
  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      // 1. Schema验证
      await HealthDataSchema.validateAsync(data);

      // 2. 业务规则验证
      await this.validateBusinessRules(data);

      // 3. 数据一致性验证
      await this.validateDataConsistency(data);

      next();
    } catch (error) {
      this.logger.error('健康数据验证失败', error);
      next(new ValidationError(error.message));
    }
  }

  // 验证业务规则
  private async validateBusinessRules(data: any) {
    // 验证数据时间范围
    if (new Date(data.timestamp) > new Date()) {
      throw new ValidationError('数据时间不能超过当前时间');
    }

    // 验证数值范围
    this.validateMetricsRange(data.metrics);
  }

  // 验证数据一致性
  private async validateDataConsistency(data: any) {
    // 验证数据完整性
    if (!this.checkDataCompleteness(data)) {
      throw new ValidationError('数据不完整');
    }

    // 验证数据关联性
    if (!this.checkDataRelations(data)) {
      throw new ValidationError('数据关联性错误');
    }
  }
}
