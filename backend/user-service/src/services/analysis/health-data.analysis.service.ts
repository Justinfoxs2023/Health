import { BaseAnalysisService } from './base.analysis.service';
import { HealthDataModel } from '../../models/health-data.model';
import { TimeRangeType } from '../../types/analysis.types';

export class HealthDataAnalysisService extends BaseAnalysisService {
  constructor() {
    super('HealthDataAnalysis', HealthDataModel);
  }

  async analyzeHealthTrends(userId: string, timeRange: TimeRangeType) {
    try {
      const pipeline = [
        { $match: { userId } },
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: this.getTimeFormat(timeRange),
                date: '$timestamp',
              },
            },
            metrics: { $push: '$metrics' },
          },
        },
        { $sort: { _id: 1 } },
      ];

      const data = await this.aggregateData(pipeline);
      return this.processHealthTrends(data);
    } catch (error) {
      this.logger.error('Health trends analysis failed', error);
      throw error;
    }
  }

  protected async calculateMetric(data: any[], metric: string): Promise<number> {
    switch (metric) {
      case 'averageHeartRate':
        return this.calculateAverageHeartRate(data);
      case 'averageBloodPressure':
        return this.calculateAverageBloodPressure(data);
      default:
        throw new Error(`Unsupported metric: ${metric}`);
    }
  }

  private getTimeFormat(timeRange: TimeRangeType): string {
    switch (timeRange) {
      case 'day':
        return '%Y-%m-%d-%H';
      case 'week':
        return '%Y-%m-%d';
      case 'month':
        return '%Y-%m';
      default:
        return '%Y-%m-%d';
    }
  }

  private processHealthTrends(data: any[]) {
    return data.map(item => ({
      timestamp: item._id,
      metrics: this.aggregateMetrics(item.metrics),
    }));
  }

  private aggregateMetrics(metrics: any[]) {
    return metrics.reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(curr[key]);
      });
      return acc;
    }, {});
  }
}
