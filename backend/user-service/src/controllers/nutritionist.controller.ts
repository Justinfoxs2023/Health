import { Request, Response } from 'express';
import { NutritionistService } from '../services/nutritionist.service';
import { Logger } from '../utils/logger';

export class NutritionistController {
  private nutritionistService: NutritionistService;
  private logger: Logger;

  constructor() {
    this.nutritionistService = new NutritionistService();
    this.logger = new Logger('NutritionistController');
  }

  /**
   * 制定饮食计划
   */
  public async createDietPlan(req: Request, res: Response) {
    try {
      const nutritionistId = req.user.id;
      const { clientId, planDetails, duration, goals } = req.body;

      const dietPlan = await this.nutritionistService.createDietPlan({
        nutritionistId,
        clientId,
        planDetails,
        duration,
        goals,
        startDate: new Date()
      });

      return res.status(201).json({
        code: 201,
        data: dietPlan,
        message: '饮食计划创建成功'
      });
    } catch (error) {
      this.logger.error('创建饮食计划失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 营养评估
   */
  public async nutritionAssessment(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { assessmentData } = req.body;

      const assessment = await this.nutritionistService.createAssessment({
        clientId,
        assessmentData,
        date: new Date()
      });

      return res.json({
        code: 200,
        data: assessment,
        message: '营养评估完成'
      });
    } catch (error) {
      this.logger.error('营养评估失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 饮食建议
   */
  public async provideDietaryAdvice(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { advice, recommendations } = req.body;

      const dietaryAdvice = await this.nutritionistService.createDietaryAdvice({
        clientId,
        advice,
        recommendations,
        date: new Date()
      });

      return res.json({
        code: 200,
        data: dietaryAdvice,
        message: '饮食建议提供成功'
      });
    } catch (error) {
      this.logger.error('提供饮食建议失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 