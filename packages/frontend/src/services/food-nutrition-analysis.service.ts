import { CacheStrategyService } from './cache-strategy.service';
import { api } from '../utils';

export interface INutritionInfo {
  /** calories 的描述 */
  calories: number;
  /** protein 的描述 */
  protein: number;
  /** carbs 的描述 */
  carbs: number;
  /** fat 的描述 */
  fat: number;
  /** fiber 的描述 */
  fiber: number;
  /** vitamins 的描述 */
  vitamins: Record<string, number>;
  /** minerals 的描述 */
  minerals: Record<string, number>;
}

export interface IFoodRecord {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** items 的描述 */
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    nutrition: INutritionInfo;
  }>;
  /** totalNutrition 的描述 */
  totalNutrition: INutritionInfo;
  /** mealType 的描述 */
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  /** aiSuggestions 的描述 */
  aiSuggestions?: string[];
}

export class FoodNutritionAnalysisService {
  private cache: CacheStrategyService;

  constructor() {
    this.cache = new CacheStrategyService();
  }

  // 分析食物营养成分
  async analyzeFoodNutrition(
    foodItems: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>,
  ): Promise<IFoodRecord> {
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
      console.error('Error in food-nutrition-analysis.service.ts:', '营养成分分析失败:', error);
      throw error;
    }
  }

  // 获取每日营养摄入统计
  async getDailyNutritionStats(
    userId: string,
    date: Date,
  ): Promise<{
    total: INutritionInfo;
    meals: Record<string, IFoodRecord>;
    recommendations: string[];
  }> {
    try {
      const response = await api.get('/api/nutrition/daily-stats', {
        params: { userId, date: date.toISOString() },
      });
      return response.data;
    } catch (error) {
      console.error('Error in food-nutrition-analysis.service.ts:', '获取每日营养统计失败:', error);
      throw error;
    }
  }

  // 生成AI饮食建议
  async generateDietarySuggestions(userId: string): Promise<string[]> {
    try {
      const response = await api.post('/api/nutrition/suggestions', { userId });
      return response.data;
    } catch (error) {
      console.error('Error in food-nutrition-analysis.service.ts:', '生成饮食建议失败:', error);
      throw error;
    }
  }

  private generateCacheKey(foodItems: any[]): string {
    return `nutrition:${JSON.stringify(foodItems)}`;
  }
}
