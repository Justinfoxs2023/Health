import { Request, Response } from 'express';
import { SecurityAIService } from '../services/ai/security-ai.service';
import { Logger } from '../utils/logger';

export class SecurityController {
  private securityAI: SecurityAIService;
  private logger: Logger;

  constructor() {
    this.securityAI = new SecurityAIService();
    this.logger = new Logger('Security');
  }

  // 检测威胁
  async detectThreats(req: Request, res: Response) {
    try {
      const { activity } = req.body;
      const assessment = await this.securityAI.detectThreats(activity);
      
      return res.json({
        code: 200,
        data: assessment,
        message: '威胁检测完成'
      });
    } catch (error) {
      this.logger.error('威胁检测失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  // 分析用户行为
  async analyzeBehavior(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { activities } = req.body;
      const analysis = await this.securityAI.analyzeBehavior(userId, activities);
      
      return res.json({
        code: 200,
        data: analysis,
        message: '行为分析完成'
      });
    } catch (error) {
      this.logger.error('行为分析失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  // 评估风险
  async assessRisk(req: Request, res: Response) {
    try {
      const { action, context } = req.body;
      const assessment = await this.securityAI.assessRisk(action, context);
      
      return res.json({
        code: 200,
        data: assessment,
        message: '风险评估完成'
      });
    } catch (error) {
      this.logger.error('风险评估失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 