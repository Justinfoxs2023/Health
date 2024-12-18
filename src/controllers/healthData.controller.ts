import { HealthDataService } from '../services/healthData.service';
import { Request, Response } from 'express';

export class HealthDataController {
  private healthDataService: HealthDataService;

  constructor() {
    this.healthDataService = new HealthDataService();
  }

  async getHealthData(req: Request, res: Response) {
    const { range = 'week' } = req.query;
    try {
      const data = await this.healthDataService.getHealthData(range as string);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: '获取健康数据失败', error });
    }
  }
}
