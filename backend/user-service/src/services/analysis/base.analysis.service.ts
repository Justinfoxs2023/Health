import { BaseService } from '../base.service';
import { Logger } from '../../utils/logger';
import { DatabaseOperations } from '../../database/operations';
import { AnalysisError } from '../../utils/errors';

export abstract class BaseAnalysisService extends BaseService {
  protected dbOps: DatabaseOperations<any>;

  constructor(serviceName: string, model: any) {
    super(serviceName);
    this.dbOps = new DatabaseOperations(model, serviceName);
  }

  protected async aggregateData(pipeline: any[], options?: any) {
    try {
      return await this.dbOps.model.aggregate(pipeline).exec();
    } catch (error) {
      this.logger.error('Data aggregation failed', error);
      throw new AnalysisError('数据聚合失败');
    }
  }

  protected async calculateMetrics(data: any[], metrics: string[]) {
    try {
      const results: Record<string, number> = {};
      
      for (const metric of metrics) {
        results[metric] = await this.calculateMetric(data, metric);
      }

      return results;
    } catch (error) {
      this.logger.error('Metrics calculation failed', error);
      throw new AnalysisError('指标计算失败');
    }
  }

  protected abstract calculateMetric(data: any[], metric: string): Promise<number>;
} 