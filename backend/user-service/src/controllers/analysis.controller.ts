import { BaseProfessionalController } from './base.professional.controller';
import { HealthDataAnalysisService } from '../services/analysis/health-data.analysis.service';
import { Request, Response } from 'express';

export class AnalysisController extends BaseProfessionalController {
  private healthDataAnalysisService: HealthDataAnalysisService;

  constructor() {
    super('AnalysisController');
    this.healthDataAnalysisService = new HealthDataAnalysisService();
  }

  public async analyzeHealthTrends(req: Request, res: Response) {
    try {
      const userId = this.validateUser(req);
      const { timeRange = 'week' } = req.query;

      const trends = await this.healthDataAnalysisService.analyzeHealthTrends(
        userId,
        timeRange as string,
      );

      return this.success(res, trends);
    } catch (error) {
      return this.handleError(res, error, '分析健康趋势失败');
    }
  }

  public async getHealthMetrics(req: Request, res: Response) {
    try {
      const userId = this.validateUser(req);
      const { metrics = [] } = req.body;

      const data = await this.healthDataAnalysisService.calculateMetrics([userId], metrics);

      return this.success(res, data);
    } catch (error) {
      return this.handleError(res, error, '获取健康指标失败');
    }
  }
}
