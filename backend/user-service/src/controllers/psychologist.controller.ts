import { Request, Response } from 'express';
import { PsychologistService } from '../services/psychologist.service';
import { Logger } from '../utils/logger';

export class PsychologistController {
  private psychologistService: PsychologistService;
  private logger: Logger;

  constructor() {
    this.psychologistService = new PsychologistService();
    this.logger = new Logger('PsychologistController');
  }

  /**
   * 心理评估
   */
  public async psychologicalAssessment(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { assessmentType, responses, observations } = req.body;

      const assessment = await this.psychologistService.createAssessment({
        clientId,
        assessmentType,
        responses,
        observations,
        date: new Date()
      });

      return res.json({
        code: 200,
        data: assessment,
        message: '心理评估完成'
      });
    } catch (error) {
      this.logger.error('心理评估失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 创建咨询记录
   */
  public async createCounselingRecord(req: Request, res: Response) {
    try {
      const counselorId = req.user.id;
      const { clientId, sessionType, content, observations, plans } = req.body;

      const record = await this.psychologistService.createCounselingRecord({
        counselorId,
        clientId,
        sessionType,
        content,
        observations,
        plans,
        date: new Date()
      });

      return res.status(201).json({
        code: 201,
        data: record,
        message: '咨询记录创建成功'
      });
    } catch (error) {
      this.logger.error('创建咨询记录失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 制定心理干预计划
   */
  public async createInterventionPlan(req: Request, res: Response) {
    try {
      const counselorId = req.user.id;
      const { clientId, diagnosis, interventions, goals, duration } = req.body;

      const plan = await this.psychologistService.createInterventionPlan({
        counselorId,
        clientId,
        diagnosis,
        interventions,
        goals,
        duration,
        startDate: new Date()
      });

      return res.status(201).json({
        code: 201,
        data: plan,
        message: '干预计划创建成功'
      });
    } catch (error) {
      this.logger.error('创建干预计划失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 情绪监测记录
   */
  public async emotionalMonitoring(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { emotions, triggers, copingStrategies } = req.body;

      const record = await this.psychologistService.createEmotionalRecord({
        clientId,
        emotions,
        triggers,
        copingStrategies,
        date: new Date()
      });

      return res.json({
        code: 200,
        data: record,
        message: '情绪记录创建成功'
      });
    } catch (error) {
      this.logger.error('创建情绪记录失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 