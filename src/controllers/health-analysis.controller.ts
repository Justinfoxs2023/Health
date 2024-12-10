import { Request, Response } from 'express';
import { HealthAIService } from '../services/ai/health-ai.service';
import { Logger } from '../utils/logger';

export class HealthAnalysisController {
  private healthAI: HealthAIService;
  private logger: Logger;

  constructor() {
    this.healthAI = new HealthAIService();
    this.logger = new Logger('HealthAnalysis');
  }

  // 健康风险评估
  async assessHealthRisks(req: Request, res: Response) {
    try {
      const { healthData } = req.body;
      const assessment = await this.healthAI.predictHealthRisks(healthData);
      
      return res.json({
        code: 200,
        data: assessment,
        message: '健康风险评估完成'
      });
    } catch (error) {
      this.logger.error('健康风险评估失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  // 获取健康建议
  async getRecommendations(req: Request, res: Response) {
    try {
      const { healthData, userProfile } = req.body;
      const recommendations = await this.healthAI.generateRecommendations(
        healthData,
        userProfile
      );
      
      return res.json({
        code: 200,
        data: recommendations,
        message: '健康建议生成成功'
      });
    } catch (error) {
      this.logger.error('生成健康建议失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 