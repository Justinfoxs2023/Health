import { Request, Response } from 'express';
import { AdvisorService } from '../services/advisor.service';
import { Logger } from '../utils/logger';

export class AdvisorController {
  private advisorService: AdvisorService;
  private logger: Logger;

  constructor() {
    this.advisorService = new AdvisorService();
    this.logger = new Logger('AdvisorController');
  }

  /**
   * 获取客户列表
   */
  public async getClientList(req: Request, res: Response) {
    try {
      const advisorId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const clients = await this.advisorService.getClientList(
        advisorId,
        Number(page),
        Number(limit),
        status as string
      );

      return res.json({
        code: 200,
        data: clients
      });
    } catch (error) {
      this.logger.error('获取客户列表失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 创建健康计划
   */
  public async createHealthPlan(req: Request, res: Response) {
    try {
      const advisorId = req.user.id;
      const { clientId, planType, goals, activities, duration } = req.body;

      const healthPlan = await this.advisorService.createHealthPlan({
        advisorId,
        clientId,
        planType,
        goals,
        activities,
        duration
      });

      return res.status(201).json({
        code: 201,
        data: healthPlan,
        message: '健康计划创建成功'
      });
    } catch (error) {
      this.logger.error('创建健康计划失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 监控客户进度
   */
  public async monitorProgress(req: Request, res: Response) {
    try {
      const advisorId = req.user.id;
      const clientId = req.params.clientId;
      const { startDate, endDate } = req.query;

      const progress = await this.advisorService.getClientProgress(
        advisorId,
        clientId,
        startDate as string,
        endDate as string
      );

      return res.json({
        code: 200,
        data: progress
      });
    } catch (error) {
      this.logger.error('获取客户进度失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 