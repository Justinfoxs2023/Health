import { Request, Response } from 'express';
import { SurveyService } from '../services/survey.service';
import { AIAnalysisService } from '../services/ai.service';
import { Logger } from '../utils/logger';

export class SurveyController {
  private surveyService: SurveyService;
  private aiService: AIAnalysisService;
  private logger: Logger;

  constructor() {
    this.surveyService = new SurveyService();
    this.aiService = new AIAnalysisService();
    this.logger = new Logger('SurveyController');
  }

  public async submitSurvey(req: Request, res: Response) {
    try {
      const surveyData = req.body;
      const userId = req.user?.id;

      // 保存问卷结果
      const surveyResult = await this.surveyService.saveSurveyResults(userId, surveyData);
      
      // 生成AI分析报告
      const healthReport = await this.aiService.generateHealthReport(surveyResult);
      
      return res.json({
        success: true,
        data: {
          surveyResult,
          healthReport
        }
      });
    } catch (error) {
      this.logger.error('提交问卷失败', error);
      return res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }

  public async getSurveyResults(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const results = await this.surveyService.getUserSurveyResults(userId);
      
      return res.json({
        success: true,
        data: results
      });
    } catch (error) {
      this.logger.error('获取问卷结果失败', error);
      return res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
} 