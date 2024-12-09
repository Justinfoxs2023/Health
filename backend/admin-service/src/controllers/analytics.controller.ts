import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AnalyticsService } from '../services/analytics.service';
import { Logger } from '../utils/logger';
import { AnalyticsError } from '../utils/errors';

export class AnalyticsController extends BaseController {
  private analyticsService: AnalyticsService;
  private logger: Logger;

  constructor() {
    super('AnalyticsController');
    this.analyticsService = new AnalyticsService();
    this.logger = new Logger('AnalyticsController');
  }

  public async getMetrics(req: Request, res: Response) {
    try {
      const { startDate, endDate, metrics = [] } = req.query;
      
      const data = await this.analyticsService.getMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        metrics: metrics as string[]
      });

      return this.success(res, data);
    } catch (error) {
      this.logger.error('获取指标数据失败', error);
      return this.error(res, error);
    }
  }

  public async generateReport(req: Request, res: Response) {
    try {
      const { reportType, timeRange, filters } = req.body;
      
      const report = await this.analyticsService.generateReport({
        type: reportType,
        timeRange,
        filters
      });

      return this.success(res, report);
    } catch (error) {
      this.logger.error('生成报告失败', error);
      return this.error(res, error);
    }
  }

  public async getHealthTrends(req: Request, res: Response) {
    try {
      const { userId, timeRange = 'week' } = req.query;
      
      const trends = await this.analyticsService.getHealthTrends(
        userId as string,
        timeRange as string
      );

      return this.success(res, trends);
    } catch (error) {
      this.logger.error('获取健康趋势失败', error);
      return this.error(res, error);
    }
  }
} 