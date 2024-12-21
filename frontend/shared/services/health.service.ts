import { ApiService } from './api.service';
import { storage } from '../utils';

export class HealthService {
  private api: ApiService;

  constructor() {
    this.api = ApiService.getInstance();
  }

  /**
   * 记录健康数据
   */
  async recordHealth(data: { type: string; metrics: any; deviceId?: string; location?: string }) {
    return this.api.post('/health/record', data);
  }

  /**
   * 获取健康数据历史
   */
  async getHealthHistory(params: { type: string; startDate: Date; endDate: Date; limit?: number }) {
    return this.api.get('/health/history', { params });
  }

  /**
   * 生成健康报告
   */
  async generateReport(timeRange: string) {
    return this.api.get('/health/report', {
      params: { timeRange },
    });
  }

  /**
   * 缓存最新健康数据
   */
  async cacheLatestData(type: string, data: any) {
    const key = `health:${type}:latest`;
    await storage.set(key, {
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 获取缓存的健康数据
   */
  async getCachedData(type: string) {
    const key = `health:${type}:latest`;
    return storage.get(key);
  }
}
