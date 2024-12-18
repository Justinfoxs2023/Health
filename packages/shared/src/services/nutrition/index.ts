import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';
import { BehaviorSubject } from 'rxjs';

interface INutritionInfo {
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
  vitamins: {
    a: number;
    b1: number;
    b2: number;
    b3: number;
    b6: number;
    b12: number;
    c: number;
    d: number;
    e: number;
    k: number;
  };
  /** minerals 的描述 */
  minerals: {
    calcium: number;
    iron: number;
    magnesium: number;
    phosphorus: number;
    potassium: number;
    sodium: number;
    zinc: number;
  };
}

interface IFoodItem {
  /** name 的描述 */
  name: string;
  /** nutrition 的描述 */
  nutrition: INutritionInfo;
  /** portion 的描述 */
  portion: number;
  /** unit 的描述 */
  unit: string;
  /** image 的描述 */
  image?: string;
  /** category 的描述 */
  category: string;
  /** tags 的描述 */
  tags: string[];
  /** seasonality 的描述 */
  seasonality?: string[];
  /** allergens 的描述 */
  allergens?: string[];
  /** alternatives 的描述 */
  alternatives?: string[];
}

interface INutritionAnalysisResult {
  /** foods 的描述 */
  foods: IFoodItem[];
  /** totalNutrition 的描述 */
  totalNutrition: INutritionInfo;
  /** recommendations 的描述 */
  recommendations: string[];
  /** score 的描述 */
  score: number;
  /** timestamp 的描述 */
  timestamp: number;
  /** mealType 的描述 */
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  /** healthyAlternatives 的描述 */
  healthyAlternatives: IFoodItem[];
  /** nutritionBalance 的描述 */
  nutritionBalance: {
    [key: string]: {
      current: number;
      recommended: number;
      status: 'low' | 'good' | 'high';
    };
  };
}

interface INutritionState {
  /** analyzing 的描述 */
  analyzing: boolean;
  /** result 的描述 */
  result: INutritionAnalysisResult | null;
  /** error 的描述 */
  error: Error | null;
  /** lastAnalysis 的描述 */
  lastAnalysis: Date | null;
  /** dailyNutrition 的描述 */
  dailyNutrition: {
    current: INutritionInfo;
    target: INutritionInfo;
    remaining: INutritionInfo;
  } | null;
}

export class NutritionService {
  private model: tf.GraphModel | null = null;
  private foodDatabase: Map<string, IFoodItem> = new Map();
  private state$ = new BehaviorSubject<INutritionState>({
    analyzing: false,
    result: null,
    error: null,
    lastAnalysis: null,
    dailyNutrition: null,
  });

  private userPreferences: {
    dietaryRestrictions: string[];
    allergies: string[];
    preferences: string[];
    goals: string[];
  } = {
    dietaryRestrictions: [],
    allergies: [],
    preferences: [],
    goals: [],
  };

  constructor() {
    this.initializeModel();
    this.loadFoodDatabase();
  }

  // 设置用户偏好
  setUserPreferences(preferences: typeof this.userPreferences) {
    this.userPreferences = preferences;
  }

  // 获取每日营养目标
  private getDailyNutritionTargets(): INutritionInfo {
    // 基于用户目标和偏好计算推荐值
    return {
      calories: 2000,
      protein: 50,
      carbs: 250,
      fat: 70,
      fiber: 25,
      vitamins: {
        a: 900,
        b1: 1.2,
        b2: 1.3,
        b3: 16,
        b6: 1.7,
        b12: 2.4,
        c: 90,
        d: 15,
        e: 15,
        k: 120,
      },
      minerals: {
        calcium: 1000,
        iron: 18,
        magnesium: 400,
        phosphorus: 700,
        potassium: 3500,
        sodium: 2300,
        zinc: 11,
      },
    };
  }

  // 分析图片中的食物
  async analyzeImage(
    image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  ) {
    if (!this.model) {
      throw new Error('模型未初始化');
    }

    this.state$.next({
      ...this.state$.value,
      analyzing: true,
    });

    try {
      // 预处理图像
      const tensor = tf.tidy(() => {
        return tf.browser
          .fromPixels(image)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims();
      });

      // 运行模型
      const predictions = (await this.model.predict(tensor)) as tf.Tensor;
      const results = await this.processPredictions(predictions);

      // 计算总营养成分
      const totalNutrition = this.calculateTotalNutrition(results);

      // 分析营养平衡
      const nutritionBalance = this.analyzeNutritionBalance(totalNutrition);

      // 生成健康替代品建议
      const healthyAlternatives = await this.generateHealthyAlternatives(results);

      // 生成建议
      const recommendations = this.generateRecommendations(totalNutrition, nutritionBalance);

      // 计算营养评分
      const score = this.calculateNutritionScore(totalNutrition, nutritionBalance);

      const result: INutritionAnalysisResult = {
        foods: results,
        totalNutrition,
        recommendations,
        score,
        timestamp: Date.now(),
        mealType,
        healthyAlternatives,
        nutritionBalance,
      };

      // 更新每日营养摄入
      this.updateDailyNutrition(totalNutrition);

      this.state$.next({
        analyzing: false,
        result,
        error: null,
        lastAnalysis: new Date(),
        dailyNutrition: this.state$.value.dailyNutrition,
      });

      // 清理张量
      tensor.dispose();
      predictions.dispose();

      return result;
    } catch (error) {
      this.updateError(error as Error);
      throw error;
    }
  }

  // 分析营养平衡
  private analyzeNutritionBalance(nutrition: INutritionInfo) {
    const targets = this.getDailyNutritionTargets();
    const balance: INutritionAnalysisResult['nutritionBalance'] = {};

    // 分析主要营养素
    const nutrients = {
      calories: { min: 0.8, max: 1.2 },
      protein: { min: 0.8, max: 1.2 },
      carbs: { min: 0.8, max: 1.2 },
      fat: { min: 0.8, max: 1.2 },
      fiber: { min: 0.8, max: 1.2 },
    };

    for (const [nutrient, range] of Object.entries(nutrients)) {
      const current = nutrition[nutrient as keyof typeof nutrition] as number;
      const recommended = targets[nutrient as keyof typeof targets] as number;
      const ratio = current / recommended;

      balance[nutrient] = {
        current,
        recommended,
        status: ratio < range.min ? 'low' : ratio > range.max ? 'high' : 'good',
      };
    }

    return balance;
  }

  // 生成健康替代品建议
  private async generateHealthyAlternatives(foods: IFoodItem[]): Promise<IFoodItem[]> {
    const alternatives: IFoodItem[] = [];

    for (const food of foods) {
      // 查找营养更好的替代品
      const betterOptions = Array.from(this.foodDatabase.values())
        .filter(
          item =>
            item.category === food.category &&
            item.nutrition.calories < food.nutrition.calories &&
            item.nutrition.protein >= food.nutrition.protein &&
            !this.userPreferences.allergies.some(allergen => item.allergens?.includes(allergen)),
        )
        .sort(
          (a, b) =>
            this.calculateNutritionScore(b.nutrition, {}) -
            this.calculateNutritionScore(a.nutrition, {}),
        )
        .slice(0, 3);

      alternatives.push(...betterOptions);
    }

    return alternatives;
  }

  // 更新每日营养摄入
  private updateDailyNutrition(nutrition: INutritionInfo) {
    const target = this.getDailyNutritionTargets();
    const current = this.state$.value.dailyNutrition?.current || this.getEmptyNutritionInfo();

    // 更新当前摄入
    const updatedCurrent = this.addNutrition(current, nutrition);

    // 计算剩余需求
    const remaining = this.subtractNutrition(target, updatedCurrent);

    this.state$.next({
      ...this.state$.value,
      dailyNutrition: {
        current: updatedCurrent,
        target,
        remaining,
      },
    });
  }

  // 获取空的营养信息对象
  private getEmptyNutritionInfo(): INutritionInfo {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      vitamins: {
        a: 0,
        b1: 0,
        b2: 0,
        b3: 0,
        b6: 0,
        b12: 0,
        c: 0,
        d: 0,
        e: 0,
        k: 0,
      },
      minerals: {
        calcium: 0,
        iron: 0,
        magnesium: 0,
        phosphorus: 0,
        potassium: 0,
        sodium: 0,
        zinc: 0,
      },
    };

    foods.forEach(food => {
      const { nutrition, portion } = food;
      total.calories += nutrition.calories * portion;
      total.protein += nutrition.protein * portion;
      total.carbs += nutrition.carbs * portion;
      total.fat += nutrition.fat * portion;
      total.fiber += nutrition.fiber * portion;

      // 累加维生素
      Object.keys(nutrition.vitamins).forEach(vitamin => {
        total.vitamins[vitamin as keyof typeof total.vitamins] +=
          nutrition.vitamins[vitamin as keyof typeof nutrition.vitamins] * portion;
      });

      // 累加矿物质
      Object.keys(nutrition.minerals).forEach(mineral => {
        total.minerals[mineral as keyof typeof total.minerals] +=
          nutrition.minerals[mineral as keyof typeof nutrition.minerals] * portion;
      });
    });

    return total;
  }

  // 生成营养建议
  private generateRecommendations(nutrition: INutritionInfo): string[] {
    const recommendations: string[] = [];

    // 卡路里建议
    if (nutrition.calories > 800) {
      recommendations.push('当前餐点热量偏高，建议减少食用量或选择低热量替代品');
    }

    // 蛋白质建议
    if (nutrition.protein < 20) {
      recommendations.push('蛋白质摄入不足，建议增加瘦肉、鱼类、蛋类或豆制品的摄入');
    }

    // 碳水化合物建议
    if (nutrition.carbs > 100) {
      recommendations.push('碳水化合物摄入偏高，建议减少精制淀粉的摄入，选择全谷物');
    }

    // 脂肪建议
    if (nutrition.fat > 30) {
      recommendations.push('脂肪摄入偏高，建议减少油炸食品，选择烤、煮等烹饪方式');
    }

    // 膳食纤维建议
    if (nutrition.fiber < 8) {
      recommendations.push('膳食纤维摄入不足，建议增加蔬菜、水果的摄入');
    }

    // 维��素建议
    if (nutrition.vitamins.c < 30) {
      recommendations.push('维生素C摄入不足，建议增加新鲜蔬果的摄入');
    }

    // 矿物质建议
    if (nutrition.minerals.calcium < 300) {
      recommendations.push('钙质摄入不足，建议增加奶制品或深绿色蔬菜的摄入');
    }

    return recommendations;
  }

  // 计算营养评分
  private calculateNutritionScore(nutrition: INutritionInfo): number {
    let score = 100;

    // 扣分规则
    if (nutrition.calories > 800) score -= 10;
    if (nutrition.protein < 20) score -= 10;
    if (nutrition.carbs > 100) score -= 5;
    if (nutrition.fat > 30) score -= 10;
    if (nutrition.fiber < 8) score -= 5;

    // 维生素得分
    const vitaminScore = Object.values(nutrition.vitamins).reduce((acc, val) => {
      return acc + (val >= 15 ? 2 : 0);
    }, 0);
    score += vitaminScore;

    // 矿物质得分
    const mineralScore = Object.values(nutrition.minerals).reduce((acc, val) => {
      return acc + (val >= 15 ? 2 : 0);
    }, 0);
    score += mineralScore;

    return Math.max(0, Math.min(100, score));
  }

  // 获取食物详细信息
  async getFoodDetails(foodName: string): Promise<IFoodItem | null> {
    return this.foodDatabase.get(foodName) || null;
  }

  // 搜索食物
  async searchFood(query: string): Promise<IFoodItem[]> {
    const results: IFoodItem[] = [];
    this.foodDatabase.forEach(food => {
      if (
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ) {
        results.push(food);
      }
    });
    return results;
  }

  // 获取营养建议
  async getNutritionAdvice(nutrition: INutritionInfo) {
    return this.generateRecommendations(nutrition);
  }

  // 清理资源
  async dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }

  private updateError(error: Error) {
    this.state$.next({
      ...this.state$.value,
      analyzing: false,
      error,
    });
  }
}

export const nutritionService = new NutritionService();
