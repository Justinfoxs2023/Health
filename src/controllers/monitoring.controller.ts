import { Logger } from '../utils/logger';
import { MonitoringAIService } from '../services/ai/monitoring-ai.service';
import { Request, Response } from 'express';

export class MonitoringController {
  private monitoringAI: MonitoringAIService;
  private logger: Logger;

  constructor() {
    this.monitoringAI = new MonitoringAIService();
    this.logger = new Logger('Monitoring');
  }

  // 获取性能指标
  async getPerformanceMetrics(req: Request, res: Response) {
    try {
      const metrics = await this.monitoringAI.monitorPerformance();

      return res.json({
        code: 200,
        data: metrics,
        message: '性能指标获取成功',
      });
    } catch (error) {
      this.logger.error('获取性能指标失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  // 检测系统异常
  async detectAnomalies(req: Request, res: Response) {
    try {
      const metrics = await this.monitoringAI.monitorPerformance();
      const anomalies = await this.monitoringAI.detectAnomalies(metrics);

      return res.json({
        code: 200,
        data: anomalies,
        message: '异常检测完成',
      });
    } catch (error) {
      this.logger.error('异常检测失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  // 获取优化建议
  async getOptimizationPlan(req: Request, res: Response) {
    try {
      const metrics = await this.monitoringAI.monitorPerformance();
      const plan = await this.monitoringAI.optimizeResources(metrics);

      return res.json({
        code: 200,
        data: plan,
        message: '优化计划生成成功',
      });
    } catch (error) {
      this.logger.error('生成优化计划失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
