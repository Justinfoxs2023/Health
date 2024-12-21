import { FitnessService } from '../services/fitness.service';
import { Logger } from '../utils/logger';
import { Request, Response } from 'express';

export class FitnessController {
  private fitnessService: FitnessService;
  private logger: Logger;

  constructor() {
    this.fitnessService = new FitnessService();
    this.logger = new Logger('FitnessController');
  }

  /**
   * 创建训练计划
   */
  public async createTrainingPlan(req: Request, res: Response) {
    try {
      const coachId = req.user.id;
      const { clientId, exercises, schedule, intensity } = req.body;

      const trainingPlan = await this.fitnessService.createTrainingPlan({
        coachId,
        clientId,
        exercises,
        schedule,
        intensity,
        startDate: new Date(),
      });

      return res.status(201).json({
        code: 201,
        data: trainingPlan,
        message: '训练计划创建成功',
      });
    } catch (error) {
      this.logger.error('创建训练计划失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 体能评估
   */
  public async fitnessAssessment(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { assessmentData } = req.body;

      const assessment = await this.fitnessService.createAssessment({
        clientId,
        assessmentData,
        date: new Date(),
      });

      return res.json({
        code: 200,
        data: assessment,
        message: '体能评估完成',
      });
    } catch (error) {
      this.logger.error('体能评估失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 运动指导
   */
  public async provideExerciseGuidance(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { exerciseType, guidance, corrections } = req.body;

      const exerciseGuidance = await this.fitnessService.createExerciseGuidance({
        clientId,
        exerciseType,
        guidance,
        corrections,
        date: new Date(),
      });

      return res.json({
        code: 200,
        data: exerciseGuidance,
        message: '运动指导提供成功',
      });
    } catch (error) {
      this.logger.error('提供运动指导失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 进度追踪
   */
  public async trackProgress(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { metrics, achievements, notes } = req.body;

      const progress = await this.fitnessService.recordProgress({
        clientId,
        metrics,
        achievements,
        notes,
        date: new Date(),
      });

      return res.json({
        code: 200,
        data: progress,
        message: '进度记录成功',
      });
    } catch (error) {
      this.logger.error('记录进度失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
