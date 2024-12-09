import { Logger } from '../utils/logger';
import { BaseService } from './base.service';
import { HealthData, IHealthData } from '../models/health-data.model';
import { HealthDataValidation } from '../validators/health-data.validator';
import { HealthDataError } from '../utils/errors';

export class HealthDataService extends BaseService {
  constructor() {
    super('HealthDataService');
  }

  async saveHealthData(userId: string, data: Partial<IHealthData>) {
    try {
      // 验证数据
      const validatedData = await HealthDataValidation.validate(data);
      
      // 创建健康数据记录
      const healthData = new HealthData({
        userId,
        ...validatedData,
        timestamp: new Date()
      });

      // 保存数据
      await healthData.save();

      // 更新缓存
      await this.updateHealthDataCache(userId);

      return healthData;
    } catch (error) {
      this.logger.error('保存健康数据失败', error);
      throw new HealthDataError('保存健康数据失败');
    }
  }

  async getHealthData(userId: string, options: {
    startDate?: Date;
    endDate?: Date;
    type?: string;
    metrics?: string[];
  }) {
    try {
      const query: any = { userId };

      if (options.startDate || options.endDate) {
        query.timestamp = {};
        if (options.startDate) {
          query.timestamp.$gte = options.startDate;
        }
        if (options.endDate) {
          query.timestamp.$lte = options.endDate;
        }
      }

      if (options.type) {
        query.type = options.type;
      }

      const projection = options.metrics ? 
        options.metrics.reduce((acc, metric) => ({...acc, [metric]: 1}), {}) : 
        {};

      return await HealthData.find(query, projection)
        .sort({ timestamp: -1 })
        .exec();
    } catch (error) {
      this.logger.error('获取健康数据失败', error);
      throw new HealthDataError('获取健康数据失败');
    }
  }

  async analyzeHealthTrends(userId: string, options: {
    metric: string;
    period: 'day' | 'week' | 'month';
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      const pipeline = [
        { $match: { userId } },
        { $sort: { timestamp: -1 } },
        { $group: {
          _id: {
            $dateToString: {
              format: this.getDateFormat(options.period),
              date: '$timestamp'
            }
          },
          value: { $avg: `$metrics.${options.metric}` }
        }},
        { $sort: { _id: 1 } }
      ];

      return await HealthData.aggregate(pipeline);
    } catch (error) {
      this.logger.error('分析健康趋势失败', error);
      throw new HealthDataError('分析健康趋势失败');
    }
  }

  private getDateFormat(period: string): string {
    switch (period) {
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

  private async updateHealthDataCache(userId: string) {
    try {
      const latestData = await HealthData.findOne({ userId })
        .sort({ timestamp: -1 })
        .exec();

      if (latestData) {
        await this.redis.setex(
          `health_data:${userId}:latest`,
          3600,
          JSON.stringify(latestData)
        );
      }
    } catch (error) {
      this.logger.error('更新健康数据缓存失败', error);
    }
  }
} 