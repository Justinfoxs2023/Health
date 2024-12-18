import { HealthRecordService } from '../services/health-record.service';
import { Logger } from '../utils/logger';
import { Request, Response } from 'express';

export class HealthController {
  private healthRecordService: HealthRecordService;
  private logger: Logger;

  constructor() {
    this.healthRecordService = new HealthRecordService();
    this.logger = new Logger('HealthController');
  }

  public async createRecord(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          code: 401,
          message: '未授权的访问',
        });
      }

      const healthData = req.body;
      const recordId = await this.healthRecordService.createRecord(healthData);

      return res.status(201).json({
        code: 201,
        data: { recordId },
        message: '健康记录创建成功',
      });
    } catch (error) {
      this.logger.error('创建健康记录失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 获取健康数据历史
   */
  async getHealthHistory(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { type, startDate, endDate, limit } = req.query;

      const history = await this.healthRecordService.getHistory({
        userId,
        type: type as string,
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        limit: limit ? parseInt(limit as string) : undefined,
      });

      return res.json({
        code: 200,
        data: history,
      });
    } catch (error) {
      this.logger.error('获取健康数据历史失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 生成健康报告
   */
  async generateHealthReport(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { timeRange } = req.query;

      const report = await this.healthRecordService.generateReport(userId, timeRange as string);

      return res.json({
        code: 200,
        data: report,
      });
    } catch (error) {
      this.logger.error('生成健康报告失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
