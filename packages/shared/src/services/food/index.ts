import { logger } from '../logger';

/** 食物类型 */
export enum FoodType {
  GRAIN = 'grain', // 谷物
  MEAT = 'meat', // 肉类
  VEGETABLE = 'vegetable', // 蔬菜
  FRUIT = 'fruit', // 水果
  DAIRY = 'dairy', // 乳制品
  SEAFOOD = 'seafood', // 海鲜
  NUTS = 'nuts', // 坚果
  BEVERAGE = 'beverage', // 饮品
  SNACK = 'snack', // 零食
  OTHER = 'other' // 其他
}

/** 营养素类型 */
export enum NutrientType {
  CALORIE = 'calorie', // 热量
  PROTEIN = 'protein', // 蛋白质
  FAT = 'fat', // 脂肪
  CARBOHYDRATE = 'carbohydrate', // 碳水化合物
  FIBER = 'fiber', // 膳食纤维
  VITAMIN_A = 'vitamin_a', // 维生素A
  VITAMIN_B = 'vitamin_b', // 维生素B
  VITAMIN_C = 'vitamin_c', // 维生素C
  VITAMIN_D = 'vitamin_d', // 维生素D
  VITAMIN_E = 'vitamin_e', // 维生素E
  CALCIUM = 'calcium', // 钙
  IRON = 'iron', // 铁
  ZINC = 'zinc', // 锌
  SODIUM = 'sodium' // 钠
}

/** 食物识别结果 */
export interface FoodRecognitionResult {
  /** 食物名称 */
  name: string;
  /** 食物类型 */
  type: FoodType;
  /** 置信度 */
  confidence: number;
  /** 营养成分 */
  nutrients: {
    type: NutrientType;
    value: number;
    unit: string;
  }[];
  /** 推荐摄入量 */
  recommendedIntake: number;
  /** 食物图片 */
  image?: string;
  /** 食物描述 */
  description?: string;
}

/** 营养分析结果 */
export interface NutritionAnalysis {
  /** 总热量 */
  totalCalories: number;
  /** 营养素分布 */
  nutrientDistribution: {
    type: NutrientType;
    value: number;
    percentage: number;
    status: 'low' | 'normal' | 'high';
  }[];
  /** 营养建议 */
  recommendations: {
    type: NutrientType;
    suggestion: string;
    priority: number;
  }[];
  /** 健康评分 */
  healthScore: number;
}

/** 饮食计划 */
export interface DietPlan {
  /** 计划名称 */
  name: string;
  /** 计划目标 */
  goal: 'weight_loss' | 'weight_gain' | 'maintenance' | 'muscle_gain' | 'health';
  /** 每日热量目标 */
  dailyCalorieTarget: number;
  /** 营养素目标 */
  nutrientTargets: {
    type: NutrientType;
    min: number;
    max: number;
    unit: string;
  }[];
  /** 餐次安排 */
  meals: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
    foods: {
      name: string;
      amount: number;
      unit: string;
    }[];
    calories: number;
  }[];
  /** 禁忌食物 */
  restrictions?: string[];
  /** 推荐食物 */
  recommendations?: string[];
}

/** 食物服务 */
export class FoodService {
  private static instance: FoodService;

  private constructor() {}

  /** 获取单例 */
  public static getInstance(): FoodService {
    if (!FoodService.instance) {
      FoodService.instance = new FoodService();
    }
    return FoodService.instance;
  }

  /** 识别食物 */
  public async recognizeFood(image: File): Promise<FoodRecognitionResult> {
    try {
      // 调用食物识别API
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/food/recognize', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Food recognition failed');
      }

      const result = await response.json();
      return this.enrichFoodInfo(result);
    } catch (error) {
      logger.error('Food recognition failed', { error });
      throw error;
    }
  }

  /** 分析营养成分 */
  public async analyzeNutrition(foods: FoodRecognitionResult[]): Promise<NutritionAnalysis> {
    try {
      // 计算总营养成分
      const totalNutrients = this.calculateTotalNutrients(foods);
      
      // 计算营养素分布
      const distribution = this.calculateNutrientDistribution(totalNutrients);
      
      // 生成营养建议
      const recommendations = this.generateNutritionRecommendations(distribution);
      
      // 计算健康评分
      const healthScore = this.calculateHealthScore(distribution);

      return {
        totalCalories: totalNutrients.find(n => n.type === NutrientType.CALORIE)?.value || 0,
        nutrientDistribution: distribution,
        recommendations,
        healthScore
      };
    } catch (error) {
      logger.error('Nutrition analysis failed', { error });
      throw error;
    }
  }

  /** 生成饮食计划 */
  public async generateDietPlan(
    preferences: {
      goal: DietPlan['goal'];
      restrictions?: string[];
      currentWeight?: number;
      targetWeight?: number;
      activityLevel?: 'low' | 'moderate' | 'high';
    }
  ): Promise<DietPlan> {
    try {
      // 计算每日热量需求
      const dailyCalories = this.calculateDailyCalories(preferences);
      
      // 设置营养素目标
      const nutrientTargets = this.setNutrientTargets(dailyCalories, preferences.goal);
      
      // 生成餐次安排
      const meals = await this.generateMealPlan(dailyCalories, nutrientTargets, preferences);

      return {
        name: `${preferences.goal} Diet Plan`,
        goal: preferences.goal,
        dailyCalorieTarget: dailyCalories,
        nutrientTargets,
        meals,
        restrictions: preferences.restrictions,
        recommendations: this.generateFoodRecommendations(preferences)
      };
    } catch (error) {
      logger.error('Diet plan generation failed', { error });
      throw error;
    }
  }

  /** 补充食物信息 */
  private async enrichFoodInfo(recognitionResult: any): Promise<FoodRecognitionResult> {
    try {
      // 从食物数据库获取详细信息
      const foodInfo = await this.fetchFoodInfo(recognitionResult.name);
      
      return {
        name: foodInfo.name,
        type: foodInfo.type,
        confidence: recognitionResult.confidence,
        nutrients: foodInfo.nutrients,
        recommendedIntake: foodInfo.recommendedIntake,
        image: recognitionResult.image,
        description: foodInfo.description
      };
    } catch (error) {
      logger.error('Food info enrichment failed', { error });
      throw error;
    }
  }

  /** 从数据库获取食物信息 */
  private async fetchFoodInfo(name: string): Promise<any> {
    const response = await fetch(`/api/food/info?name=${encodeURIComponent(name)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch food info');
    }
    return response.json();
  }

  /** 计算总营养成分 */
  private calculateTotalNutrients(foods: FoodRecognitionResult[]): {
    type: NutrientType;
    value: number;
    unit: string;
  }[] {
    const totals = new Map<NutrientType, { value: number; unit: string }>();

    foods.forEach(food => {
      food.nutrients.forEach(nutrient => {
        const current = totals.get(nutrient.type) || { value: 0, unit: nutrient.unit };
        totals.set(nutrient.type, {
          value: current.value + nutrient.value,
          unit: nutrient.unit
        });
      });
    });

    return Array.from(totals.entries()).map(([type, { value, unit }]) => ({
      type,
      value,
      unit
    }));
  }

  /** 计算营养素分布 */
  private calculateNutrientDistribution(totalNutrients: {
    type: NutrientType;
    value: number;
    unit: string;
  }[]): NutritionAnalysis['nutrientDistribution'] {
    return totalNutrients.map(nutrient => {
      const { percentage, status } = this.evaluateNutrientLevel(
        nutrient.type,
        nutrient.value
      );

      return {
        type: nutrient.type,
        value: nutrient.value,
        percentage,
        status
      };
    });
  }

  /** 评估营养素水平 */
  private evaluateNutrientLevel(
    type: NutrientType,
    value: number
  ): { percentage: number; status: 'low' | 'normal' | 'high' } {
    // 根据推荐摄入量评估营养素水平
    const rdi = this.getRecommendedDailyIntake(type);
    const percentage = (value / rdi) * 100;

    let status: 'low' | 'normal' | 'high';
    if (percentage < 80) {
      status = 'low';
    } else if (percentage > 120) {
      status = 'high';
    } else {
      status = 'normal';
    }

    return { percentage, status };
  }

  /** 获取推荐每日摄入量 */
  private getRecommendedDailyIntake(type: NutrientType): number {
    // 从配置获取推荐摄入量
    const RDI: Record<NutrientType, number> = {
      [NutrientType.CALORIE]: 2000,
      [NutrientType.PROTEIN]: 50,
      [NutrientType.FAT]: 70,
      [NutrientType.CARBOHYDRATE]: 260,
      [NutrientType.FIBER]: 25,
      [NutrientType.VITAMIN_A]: 800,
      [NutrientType.VITAMIN_B]: 1.3,
      [NutrientType.VITAMIN_C]: 80,
      [NutrientType.VITAMIN_D]: 5,
      [NutrientType.VITAMIN_E]: 12,
      [NutrientType.CALCIUM]: 800,
      [NutrientType.IRON]: 14,
      [NutrientType.ZINC]: 11,
      [NutrientType.SODIUM]: 2000
    };

    return RDI[type];
  }

  /** 生成营养建议 */
  private generateNutritionRecommendations(
    distribution: NutritionAnalysis['nutrientDistribution']
  ): NutritionAnalysis['recommendations'] {
    const recommendations: NutritionAnalysis['recommendations'] = [];

    distribution.forEach(nutrient => {
      if (nutrient.status !== 'normal') {
        recommendations.push({
          type: nutrient.type,
          suggestion: this.getNutrientSuggestion(nutrient.type, nutrient.status),
          priority: nutrient.status === 'low' ? 3 : 2
        });
      }
    });

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /** 获取营养素建议 */
  private getNutrientSuggestion(type: NutrientType, status: 'low' | 'high'): string {
    const suggestions: Record<NutrientType, Record<'low' | 'high', string>> = {
      [NutrientType.CALORIE]: {
        low: '建议适当增加食物摄入量',
        high: '建议控制食物摄入量'
      },
      [NutrientType.PROTEIN]: {
        low: '建议多食用瘦肉、鱼类、蛋类等优质蛋白',
        high: '建议适当减少蛋白质摄入'
      },
      // ... 其他营养素的建议
    };

    return suggestions[type]?.[status] || '建议咨询营养师获取专业建议';
  }

  /** 计算健康评分 */
  private calculateHealthScore(
    distribution: NutritionAnalysis['nutrientDistribution']
  ): number {
    let score = 100;

    distribution.forEach(nutrient => {
      if (nutrient.status === 'low') {
        score -= 10;
      } else if (nutrient.status === 'high') {
        score -= 5;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  /** 计算每日热量需求 */
  private calculateDailyCalories(preferences: {
    goal: DietPlan['goal'];
    currentWeight?: number;
    targetWeight?: number;
    activityLevel?: 'low' | 'moderate' | 'high';
  }): number {
    let baseCalories = 2000; // 基础代谢率

    // 根据活动水平调整
    const activityMultiplier = {
      low: 1.2,
      moderate: 1.5,
      high: 1.8
    };

    baseCalories *= activityMultiplier[preferences.activityLevel || 'moderate'];

    // 根据目标调整
    switch (preferences.goal) {
      case 'weight_loss':
        baseCalories *= 0.8;
        break;
      case 'weight_gain':
        baseCalories *= 1.2;
        break;
      case 'muscle_gain':
        baseCalories *= 1.1;
        break;
    }

    return Math.round(baseCalories);
  }

  /** 设置营养素目标 */
  private setNutrientTargets(
    dailyCalories: number,
    goal: DietPlan['goal']
  ): DietPlan['nutrientTargets'] {
    const targets: DietPlan['nutrientTargets'] = [];

    // 设置蛋白质目标
    const proteinTarget = {
      type: NutrientType.PROTEIN,
      min: Math.round(dailyCalories * 0.15 / 4), // 4卡路里/克蛋白质
      max: Math.round(dailyCalories * 0.25 / 4),
      unit: 'g'
    };

    // 根据目标调整蛋白质需求
    if (goal === 'muscle_gain') {
      proteinTarget.min = Math.round(dailyCalories * 0.25 / 4);
      proteinTarget.max = Math.round(dailyCalories * 0.35 / 4);
    }

    targets.push(proteinTarget);

    // 添加其他营养素目标
    targets.push(
      {
        type: NutrientType.FAT,
        min: Math.round(dailyCalories * 0.2 / 9), // 9卡路里/克脂肪
        max: Math.round(dailyCalories * 0.3 / 9),
        unit: 'g'
      },
      {
        type: NutrientType.CARBOHYDRATE,
        min: Math.round(dailyCalories * 0.45 / 4), // 4卡路里/克碳水
        max: Math.round(dailyCalories * 0.65 / 4),
        unit: 'g'
      }
    );

    return targets;
  }

  /** 生成餐次安排 */
  private async generateMealPlan(
    dailyCalories: number,
    nutrientTargets: DietPlan['nutrientTargets'],
    preferences: {
      goal: DietPlan['goal'];
      restrictions?: string[];
    }
  ): Promise<DietPlan['meals']> {
    // 分配热量到各餐次
    const mealDistribution = {
      breakfast: 0.3,
      lunch: 0.4,
      dinner: 0.25,
      snack: 0.05
    };

    const meals: DietPlan['meals'] = [];

    for (const [type, percentage] of Object.entries(mealDistribution)) {
      const mealCalories = Math.round(dailyCalories * percentage);
      const foods = await this.recommendFoodsForMeal(
        type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        mealCalories,
        nutrientTargets,
        preferences
      );

      meals.push({
        type: type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        time: this.getMealTime(type as 'breakfast' | 'lunch' | 'dinner' | 'snack'),
        foods,
        calories: mealCalories
      });
    }

    return meals;
  }

  /** 推荐餐次食物 */
  private async recommendFoodsForMeal(
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    targetCalories: number,
    nutrientTargets: DietPlan['nutrientTargets'],
    preferences: {
      goal: DietPlan['goal'];
      restrictions?: string[];
    }
  ): Promise<{ name: string; amount: number; unit: string; }[]> {
    // 从食物数据库中选择合适的食物
    const response = await fetch('/api/food/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mealType,
        targetCalories,
        nutrientTargets,
        restrictions: preferences.restrictions
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get food recommendations');
    }

    return response.json();
  }

  /** 获取餐次时间 */
  private getMealTime(type: 'breakfast' | 'lunch' | 'dinner' | 'snack'): string {
    const times = {
      breakfast: '07:30',
      lunch: '12:00',
      dinner: '18:30',
      snack: '15:30'
    };

    return times[type];
  }

  /** 生成食物推荐 */
  private generateFoodRecommendations(preferences: {
    goal: DietPlan['goal'];
    restrictions?: string[];
  }): string[] {
    const recommendations: string[] = [];

    switch (preferences.goal) {
      case 'weight_loss':
        recommendations.push(
          '富含蛋白质的瘦肉',
          '低脂乳制品',
          '全谷物',
          '新鲜蔬菜',
          '水果'
        );
        break;
      case 'muscle_gain':
        recommendations.push(
          '优质蛋白质食物',
          '全谷物',
          '健康脂肪',
          '蛋白质粉',
          '坚果'
        );
        break;
      // ... 其他目标的推荐
    }

    // 排除限制食物
    return recommendations.filter(
      food => !preferences.restrictions?.some(r => food.includes(r))
    );
  }
}

export const foodService = FoodService.getInstance(); 