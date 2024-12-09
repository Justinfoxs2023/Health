import * as tf from '@tensorflow/tfjs';
import { LocalDatabase } from '../utils/local-database';
import { NutritionInfo, FoodRecord } from './food-nutrition-analysis.service';

export class OfflineFoodAnalysisService {
  private db: LocalDatabase;
  private model: tf.LayersModel | null = null;
  private foodDatabase: Map<string, NutritionInfo> = new Map();

  constructor() {
    this.db = new LocalDatabase('offline-food-analysis');
    this.initializeService();
  }

  private async initializeService() {
    await this.loadModel();
    await this.loadFoodDatabase();
  }

  private async loadModel() {
    try {
      // 尝试从IndexedDB加载模型
      this.model = await tf.loadLayersModel('indexeddb://food-analysis-model');
    } catch {
      // 如果本地没有模型，从服务器下载
      this.model = await tf.loadLayersModel('/models/food-analysis/model.json');
      // 保存到IndexedDB
      await this.model.save('indexeddb://food-analysis-model');
    }
  }

  private async loadFoodDatabase() {
    try {
      // 从本地数据库加载
      const storedDatabase = await this.db.get('food-database');
      if (storedDatabase) {
        this.foodDatabase = new Map(storedDatabase);
        return;
      }

      // 如果本地没有，从服务器获取
      const response = await fetch('/api/food/database');
      const database = await response.json();
      this.foodDatabase = new Map(Object.entries(database));

      // 保存到本地
      await this.db.put('food-database', Array.from(this.foodDatabase.entries()));
    } catch (error) {
      console.error('加载食物数据库失败:', error);
    }
  }

  // 离线分析食物
  async analyzeOffline(foodItems: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>): Promise<FoodRecord> {
    if (!this.model) {
      throw new Error('模型未加载');
    }

    const results = foodItems.map(item => {
      const baseNutrition = this.foodDatabase.get(item.name);
      if (!baseNutrition) {
        throw new Error(`未找到食物: ${item.name}`);
      }

      // 根据数量调整营养值
      return this.adjustNutrition(baseNutrition, item.quantity, item.unit);
    });

    // 计算总营养值
    const totalNutrition = this.calculateTotalNutrition(results);

    return {
      id: `offline-${Date.now()}`,
      userId: 'offline-user',
      timestamp: new Date(),
      items: foodItems.map((item, index) => ({
        ...item,
        nutrition: results[index]
      })),
      totalNutrition,
      mealType: this.inferMealType(new Date()),
      aiSuggestions: this.generateOfflineSuggestions(totalNutrition)
    };
  }

  private adjustNutrition(base: NutritionInfo, quantity: number, unit: string): NutritionInfo {
    const factor = this.convertToGrams(quantity, unit) / 100; // 基于100g的转换
    return {
      calories: base.calories * factor,
      protein: base.protein * factor,
      carbs: base.carbs * factor,
      fat: base.fat * factor,
      fiber: base.fiber * factor,
      vitamins: Object.fromEntries(
        Object.entries(base.vitamins).map(([k, v]) => [k, v * factor])
      ),
      minerals: Object.fromEntries(
        Object.entries(base.minerals).map(([k, v]) => [k, v * factor])
      )
    };
  }

  private convertToGrams(quantity: number, unit: string): number {
    const conversionTable: { [key: string]: number } = {
      'g': 1,
      'kg': 1000,
      'ml': 1,
      'l': 1000,
      '份': 250,
      '个': 150
    };
    return quantity * (conversionTable[unit] || 1);
  }

  private calculateTotalNutrition(items: NutritionInfo[]): NutritionInfo {
    return items.reduce((total, item) => ({
      calories: total.calories + item.calories,
      protein: total.protein + item.protein,
      carbs: total.carbs + item.carbs,
      fat: total.fat + item.fat,
      fiber: total.fiber + item.fiber,
      vitamins: Object.fromEntries(
        Object.entries(item.vitamins).map(([k, v]) => [
          k,
          (total.vitamins[k] || 0) + v
        ])
      ),
      minerals: Object.fromEntries(
        Object.entries(item.minerals).map(([k, v]) => [
          k,
          (total.minerals[k] || 0) + v
        ])
      )
    }));
  }

  private inferMealType(timestamp: Date): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
    const hour = timestamp.getHours();
    if (hour >= 5 && hour < 10) return 'breakfast';
    if (hour >= 10 && hour < 15) return 'lunch';
    if (hour >= 15 && hour < 21) return 'dinner';
    return 'snack';
  }

  private generateOfflineSuggestions(nutrition: NutritionInfo): string[] {
    const suggestions: string[] = [];
    
    // 基于营养值生成简单建议
    if (nutrition.calories > 800) {
      suggestions.push('当前餐次热量偏高，建议适当减少食用量');
    }
    if (nutrition.protein < 20) {
      suggestions.push('蛋白质摄入不足，建议增加瘦肉、鱼、蛋类等食物');
    }
    // ... 其他建议逻辑

    return suggestions;
  }
} 