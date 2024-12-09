import { Request, Response } from 'express';
import { InteractionAIService } from '../services/ai/interaction-ai.service';
import { Logger } from '../utils/logger';

export class InteractionController {
  private interactionAI: InteractionAIService;
  private logger: Logger;

  constructor() {
    this.interactionAI = new InteractionAIService();
    this.logger = new Logger('Interaction');
  }

  // 处理用户查询
  async handleQuery(req: Request, res: Response) {
    try {
      const query = req.body;
      const response = await this.interactionAI.handleUserQuery(query);
      
      return res.json({
        code: 200,
        data: response,
        message: '查询处理成功'
      });
    } catch (error) {
      this.logger.error('处理用户查询失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  // 获取UI配置
  async getUIConfig(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const behavior = await this.getUserBehavior(userId);
      const config = await this.interactionAI.customizeUI(behavior);
      
      return res.json({
        code: 200,
        data: config,
        message: 'UI配置生成成功'
      });
    } catch (error) {
      this.logger.error('生成UI配置失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 