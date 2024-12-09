import { Request, Response } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { Logger } from '../utils/logger';

export class AnalysisController {
  private analysisService: AnalysisService;
  private logger: Logger;

  constructor() {
    this.analysisService = new AnalysisService();
    this.logger = new Logger('AnalysisController');
  }

  /**
   * 生成健康分析
   */
  async generateAnalysis(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { period = 'daily' } = req.query;

      const analysis = await this.analysisService.generateAnalysis(
        userId,
        period as 'daily' | 'weekly' | 'monthly'
      );

      return res.json({
        code: 200,
        data: analysis
      });
    } catch (error) {
      this.logger.error('生成健康分析失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 获取健康分析历史
   */
  async getAnalysisHistory(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { period, startDate, endDate, limit = 10 } = req.query;

      const history = await this.analysisService.getAnalysisHistory({
        userId,
        period: period as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: Number(limit)
      });

      return res.json({
        code: 200,
        data: history
      });
    } catch (error) {
      this.logger.error('获取健康分析历史失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 获取健康趋势
   */
  async getHealthTrends(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { metrics, timeRange } = req.query;

      const trends = await this.analysisService.getHealthTrends({
        userId,
        metrics: metrics as string[],
        timeRange: timeRange as string
      });

      return res.json({
        code: 200,
        data: trends
      });
    } catch (error) {
      this.logger.error('获取健康趋势失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 