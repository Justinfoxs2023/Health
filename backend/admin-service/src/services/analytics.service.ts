import { AnalyticsError } from '../utils/errors';
import { BaseService } from './base.service';
import { DatabaseOperations } from '../database/operations';
import { HealthDataModel } from '../models/health-data.model';
import { Logger } from '../utils/logger';

export class AnalyticsService extends BaseService {
  private dbOps: DatabaseOperations<any>;
  private logger: Logger;

  constructor() {
    super('AnalyticsService');
    this.dbOps = new DatabaseOperations(HealthDataModel, 'AnalyticsService');
    this.logger = new Logger('AnalyticsService');
  }

  async getMetrics(options: { startDate: string; endDate: string; metrics: string[] }) {
    try {
      const { startDate, endDate, metrics } = options;

      const pipeline = [
        {
          $match: {
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            ...this.buildMetricsAggregation(metrics),
          },
        },
      ];

      const results = await this.dbOps.model.aggregate(pipeline);
      return this.formatMetricsResults(results[0], metrics);
    } catch (error) {
      this.logger.error('获取指标数据失败', error);
      throw new AnalyticsError('获取指标数据失败');
    }
  }

  private buildMetricsAggregation(metrics: string[]) {
    const aggregation: Record<string, any> = {};

    metrics.forEach(metric => {
      aggregation[metric] = {
        $avg: `$metrics.${metric}`,
      };
    });

    return aggregation;
  }

  private formatMetricsResults(results: any, metrics: string[]) {
    if (!results) return {};

    const formatted: Record<string, number> = {};
    metrics.forEach(metric => {
      formatted[metric] = results[metric] || 0;
    });

    return formatted;
  }
}
