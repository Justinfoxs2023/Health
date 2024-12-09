import { Response } from 'express';
import { HealthTracking } from '../models/health-tracking.model';
import { IAuthRequest, IHealthTracking, IHealthStats } from '../types/models';

export class HealthTrackingController {
  /**
   * 记录健康数据
   */
  public async trackHealth(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const trackingData = req.body;

      const tracking = new HealthTracking({
        userId,
        ...trackingData
      });

      await tracking.save();

      res.status(201).json({
        success: true,
        data: tracking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取健康记录列表
   */
  public async getHealthRecords(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { startDate, endDate, type, page = 1, limit = 10 } = req.query;

      const query: any = { userId };
      
      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        };
      }

      // 根据类型筛选
      if (type) {
        query[type as string] = { $exists: true };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const records = await HealthTracking.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await HealthTracking.countDocuments(query);

      res.json({
        success: true,
        data: records,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取健康统计数据
   */
  public async getHealthStats(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { period = '7d' } = req.query;

      const startDate = this.getStartDateForPeriod(period as string);
      const records = await HealthTracking.find({
        userId,
        date: { $gte: startDate }
      }).sort({ date: 1 });

      const stats = await this.calculateHealthStats(records, period as string);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取统计周期的起始日期
   */
  private getStartDateForPeriod(period: string): Date {
    const now = new Date();
    switch (period) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7));
      case '30d':
        return new Date(now.setDate(now.getDate() - 30));
      case '90d':
        return new Date(now.setDate(now.getDate() - 90));
      default:
        return new Date(now.setDate(now.getDate() - 7));
    }
  }

  /**
   * 计算健康统计数据
   */
  private async calculateHealthStats(records: IHealthTracking[], period: string): Promise<IHealthStats> {
    // 实现统计计算逻辑
    // 这里需要根据不同类型的数据进行统计分析
    // 返回符合IHealthStats接口的数据
    return {
      period,
      // ... 其他统计数据
    };
  }
}

export const healthTrackingController = new HealthTrackingController(); 