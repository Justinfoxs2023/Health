import { ApiService } from './api.service';
import { storage } from '../utils';

export class RecommendationService {
  private api: ApiService;

  constructor() {
    this.api = ApiService.getInstance();
  }

  /**
   * 获取推荐
   */
  async getRecommendations() {
    try {
      // 先从缓存获取
      const cachedRecommendations = await this.getCachedRecommendations();
      if (cachedRecommendations) {
        return cachedRecommendations;
      }

      // 从服务器获取新推荐
      const response = await this.api.get('/recommendations');
      
      // 缓存推荐结果
      await this.cacheRecommendations(response.data);
      
      return response.data;
    } catch (error) {
      console.error('获取推荐失败:', error);
      throw error;
    }
  }

  /**
   * 提供反馈
   */
  async provideFeedback(recommendationId: string, feedback: {
    rating: number;
    comment?: string;
    tags?: string[];
  }) {
    return this.api.post(`/recommendations/${recommendationId}/feedback`, feedback);
  }

  /**
   * 获取活动推荐
   */
  async getActivityRecommendations() {
    return this.api.get('/recommendations/activities');
  }

  /**
   * 获取饮食推荐
   */
  async getDietRecommendations() {
    return this.api.get('/recommendations/diet');
  }

  /**
   * 获取健康建议
   */
  async getHealthAdvice() {
    return this.api.get('/recommendations/advice');
  }

  /**
   * 从缓存获取推荐
   */
  private async getCachedRecommendations() {
    const cached = await storage.get('recommendations');
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = new Date().getTime();
    const cacheAge = now - new Date(timestamp).getTime();

    // 缓存超过1小时则失效
    if (cacheAge > 3600000) {
      await storage.remove('recommendations');
      return null;
    }

    return data;
  }

  /**
   * 缓存推荐结果
   */
  private async cacheRecommendations(data: any) {
    await storage.set('recommendations', JSON.stringify({
      data,
      timestamp: new Date()
    }));
  }
} 