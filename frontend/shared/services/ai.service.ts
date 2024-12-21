import { ApiService } from './api.service';
import { storage } from '../utils';

export class AIService {
  private api: ApiService;

  constructor() {
    this.api = ApiService.getInstance();
  }

  /**
   * 食物识别
   */
  async recognizeFood(imageData: FormData) {
    return this.api.post('/ai/recognize-food', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * 分析餐食
   */
  async analyzeMeal(imageData: FormData) {
    return this.api.post('/ai/analyze-meal', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * 健康评估
   */
  async assessHealth(userData: any) {
    return this.api.post('/ai/assess-health', userData);
  }

  /**
   * 生成健康报告
   */
  async generateHealthReport(userData: any) {
    return this.api.post('/ai/generate-report', userData);
  }

  /**
   * 获取健康建议
   */
  async getHealthRecommendations(assessmentId: string) {
    return this.api.get(`/ai/recommendations/${assessmentId}`);
  }

  /**
   * 缓存评估结果
   */
  async cacheAssessment(assessmentId: string, data: any) {
    const key = `assessment:${assessmentId}`;
    await storage.set(key, {
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 获取缓存的评估结果
   */
  async getCachedAssessment(assessmentId: string) {
    const key = `assessment:${assessmentId}`;
    return storage.get(key);
  }
}
