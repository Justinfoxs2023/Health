import { api } from '../utils';
import { CacheStrategyService } from './cache-strategy.service';

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
}

export interface FoodRecord {
  id: string;
  userId: string;
  timestamp: Date;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    nutrition: NutritionInfo;
  }>;
  totalNutrition: NutritionInfo;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  aiSuggestions?: string[];
}

export class FoodNutritionAnalysisService {
  private cache: CacheStrategyService;

  constructor() {
    this.cache = new CacheStrategyService();
  }

  // 分析食物营养成分
  async analyzeFoodNutrition(foodItems: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>): Promise<FoodRecord> {
    try {
      // 检查缓存
      const cacheKey = this.generateCacheKey(foodItems);
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;

      // 调用API分析营养成分
      const response = await api.post('/api/nutrition/analyze', { foodItems });
      const result = response.data;

      // 缓存结果
      await this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('营养成分分析失败:', error);
      throw error;
    }
  }

  // 获取每日营养摄入统计
  async getDailyNutritionStats(userId: string, date: Date): Promise<{
    total: NutritionInfo;
    meals: Record<string, FoodRecord>;
    recommendations: string[];
  }> {
    try {
      const response = await api.get('/api/nutrition/daily-stats', {
        params: { userId, date: date.toISOString() }
      });
      return response.data;
    } catch (error) {
      console.error('获取每日营养统计失败:', error);
      throw error;
    }
  }

  // 生成AI饮食建议
  async generateDietarySuggestions(userId: string): Promise<string[]> {
    try {
      const response = await api.post('/api/nutrition/suggestions', { userId });
      return response.data;
    } catch (error) {
      console.error('生成饮食建议失败:', error);
      throw error;
    }
  }

  private generateCacheKey(foodItems: any[]): string {
    return `nutrition:${JSON.stringify(foodItems)}`;
  }
} 