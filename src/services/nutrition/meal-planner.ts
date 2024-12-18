import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { MealPlan, MealType, FoodItem, NutritionGoal, DietaryRestriction } from './types';
import { MongoService } from '../database/mongo.service';

@Injectable()
export class MealPlannerService {
  constructor(
    private readonly config: ConfigService,
    private readonly mongo: MongoService,
    private readonly logger: LoggerService
  ) {}

  /**
   * 生成优化的饮食计划
   */
  async generateOptimizedMealPlan(
    userId: string,
    days: number,
    goal: NutritionGoal,
    restrictions: DietaryRestriction[]
  ): Promise<MealPlan> {
    try {
      // 1. 获取用户信息和偏好
      const userProfile = await this.getUserProfile(userId);
      const preferences = await this.getUserPreferences(userId);

      // 2. 计算营养需求
      const nutritionNeeds = this.calculateNutritionNeeds(userProfile, goal);

      // 3. 获取可用食物
      const availableFoods = await this.getAvailableFoods(restrictions);

      // 4. 生成初始计划
      let mealPlan = this.generateInitialPlan(days, nutritionNeeds, availableFoods, preferences);

      // 5. 优化计划
      mealPlan = this.optimizePlan(mealPlan, nutritionNeeds, restrictions);

      // 6. 保存计划
      await this.saveMealPlan(userId, mealPlan);

      return mealPlan;
    } catch (error) {
      this.logger.error('Failed to generate optimized meal plan', { error, userId });
      throw error;
    }
  }

  /**
   * 调整现有饮食计划
   */
  async adjustMealPlan(
    userId: string,
    mealPlan: MealPlan,
    adjustments: any
  ): Promise<MealPlan> {
    try {
      // 1. 验证调整的可行性
      const validationResult = this.validateAdjustments(mealPlan, adjustments);
      if (!validationResult.valid) {
        throw new Error(validationResult.reason);
      }

      // 2. 应用调整
      const adjustedPlan = this.applyAdjustments(mealPlan, adjustments);

      // 3. 重新优化
      const optimizedPlan = this.reoptimizePlan(adjustedPlan);

      // 4. 保存更新后的计划
      await this.updateMealPlan(userId, optimizedPlan);

      return optimizedPlan;
    } catch (error) {
      this.logger.error('Failed to adjust meal plan', { error, userId });
      throw error;
    }
  }

  private async getUserProfile(userId: string): Promise<any> {
    const profile = await this.mongo
      .collection('user_profiles')
      .findOne({ user_id: userId });

    if (!profile) {
      throw new Error('User profile not found');
    }

    return profile;
  }

  private async getUserPreferences(userId: string): Promise<any> {
    const preferences = await this.mongo
      .collection('user_preferences')
      .findOne({ user_id: userId });

    return preferences || { food_preferences: [], meal_times: {} };
  }

  private calculateNutritionNeeds(profile: any, goal: NutritionGoal): any {
    const bmr = this.calculateBMR(profile);
    const activityFactor = this.getActivityFactor(profile.activity_level);
    const tdee = bmr * activityFactor;

    let calorieTarget = tdee;
    switch (goal.type) {
      case 'weight_loss':
        calorieTarget = tdee - 500; // 每天减少500卡路里
        break;
      case 'weight_gain':
        calorieTarget = tdee + 500; // 每天增加500卡路里
        break;
      case 'muscle_gain':
        calorieTarget = tdee + 300; // 每天增加300卡路里
        break;
    }

    return {
      calories: calorieTarget,
      protein: this.calculateProteinNeeds(profile.weight, goal),
      fat: this.calculateFatNeeds(calorieTarget),
      carbs: this.calculateCarbNeeds(calorieTarget)
    };
  }

  private calculateBMR(profile: any): number {
    // ���用Mifflin-St Jeor公式
    const { weight, height, age, gender } = profile;
    const bmr = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? bmr + 5 : bmr - 161;
  }

  private getActivityFactor(activityLevel: string): number {
    const factors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    return factors[activityLevel] || 1.2;
  }

  private calculateProteinNeeds(weight: number, goal: NutritionGoal): number {
    switch (goal.type) {
      case 'muscle_gain':
        return weight * 2.2; // 2.2g/kg体重
      case 'weight_loss':
        return weight * 2.0; // 2.0g/kg体重
      default:
        return weight * 1.6; // 1.6g/kg体重
    }
  }

  private calculateFatNeeds(calories: number): number {
    return (calories * 0.25) / 9; // 25%的热量来自脂肪
  }

  private calculateCarbNeeds(calories: number): number {
    return (calories * 0.55) / 4; // 55%的热量来自碳水
  }

  private async getAvailableFoods(restrictions: DietaryRestriction[]): Promise<FoodItem[]> {
    let query: any = {};

    // 处理饮食限制
    if (restrictions.length > 0) {
      const restrictedFoods = restrictions.flatMap(r => r.foods || []);
      if (restrictedFoods.length > 0) {
        query.name = { $nin: restrictedFoods };
      }

      // 处理素食限制
      if (restrictions.some(r => r.type === 'vegetarian')) {
        query.category = { $ne: 'meat' };
      }
    }

    const foods = await this.mongo
      .collection('food_database')
      .find(query)
      .toArray();

    return foods;
  }

  private generateInitialPlan(
    days: number,
    nutritionNeeds: any,
    availableFoods: FoodItem[],
    preferences: any
  ): MealPlan {
    const plan: MealPlan = {
      days: [],
      totalNutrition: {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
      }
    };

    // 为每天生成三餐
    for (let i = 0; i < days; i++) {
      const dayPlan = {
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        meals: this.generateDayMeals(nutritionNeeds, availableFoods, preferences)
      };

      plan.days.push(dayPlan);
    }

    // 计算总营养
    this.calculateTotalNutrition(plan);

    return plan;
  }

  private generateDayMeals(
    nutritionNeeds: any,
    availableFoods: FoodItem[],
    preferences: any
  ): Record<MealType, FoodItem[]> {
    const meals: Record<MealType, FoodItem[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };

    // 分配每餐的营养目标
    const mealDistribution = {
      breakfast: 0.25, // 25%
      lunch: 0.35,     // 35%
      dinner: 0.30,    // 30%
      snacks: 0.10     // 10%
    };

    Object.entries(mealDistribution).forEach(([meal, ratio]) => {
      const mealNeeds = {
        calories: nutritionNeeds.calories * ratio,
        protein: nutritionNeeds.protein * ratio,
        fat: nutritionNeeds.fat * ratio,
        carbs: nutritionNeeds.carbs * ratio
      };

      meals[meal] = this.selectFoodsForMeal(
        mealNeeds,
        availableFoods,
        preferences[meal] || {}
      );
    });

    return meals;
  }

  private selectFoodsForMeal(
    mealNeeds: any,
    availableFoods: FoodItem[],
    mealPreferences: any
  ): FoodItem[] {
    const selectedFoods: FoodItem[] = [];
    let currentNutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 };

    // 根据食物类别选择食物
    const categories = ['protein', 'carbs', 'vegetables', 'fruits', 'fats'];
    categories.forEach(category => {
      const categoryFoods = availableFoods.filter(f => f.category === category);
      const categoryNeeds = this.calculateCategoryNeeds(mealNeeds, category);

      while (
        currentNutrition[category] < categoryNeeds &&
        categoryFoods.length > 0
      ) {
        // 选择最适合的食物
        const bestFood = this.findBestFood(
          categoryFoods,
          categoryNeeds - currentNutrition[category],
          mealPreferences
        );

        if (bestFood) {
          selectedFoods.push(bestFood);
          this.updateNutrition(currentNutrition, bestFood);
        } else {
          break;
        }
      }
    });

    return selectedFoods;
  }

  private calculateCategoryNeeds(mealNeeds: any, category: string): number {
    const ratios = {
      protein: 0.3,
      carbs: 0.4,
      vegetables: 0.15,
      fruits: 0.1,
      fats: 0.05
    };

    return mealNeeds.calories * ratios[category];
  }

  private findBestFood(
    foods: FoodItem[],
    targetNutrition: number,
    preferences: any
  ): FoodItem | null {
    return foods.reduce((best, current) => {
      const currentScore = this.calculateFoodScore(current, targetNutrition, preferences);
      const bestScore = best ? this.calculateFoodScore(best, targetNutrition, preferences) : -1;

      return currentScore > bestScore ? current : best;
    }, null);
  }

  private calculateFoodScore(
    food: FoodItem,
    targetNutrition: number,
    preferences: any
  ): number {
    let score = 0;

    // 营养匹配度
    score += 1 - Math.abs(food.nutrients.calories - targetNutrition) / targetNutrition;

    // 用户偏好
    if (preferences.preferred_foods?.includes(food.name)) {
      score += 0.3;
    }
    if (preferences.disliked_foods?.includes(food.name)) {
      score -= 0.5;
    }

    // 季节性
    if (this.isInSeason(food)) {
      score += 0.2;
    }

    return score;
  }

  private isInSeason(food: FoodItem): boolean {
    // TODO: 实现季节性检查
    return true;
  }

  private updateNutrition(current: any, food: FoodItem): void {
    Object.keys(current).forEach(nutrient => {
      current[nutrient] += food.nutrients[nutrient] || 0;
    });
  }

  private optimizePlan(
    plan: MealPlan,
    nutritionNeeds: any,
    restrictions: DietaryRestriction[]
  ): MealPlan {
    const optimizedPlan = { ...plan };

    // 1. 检查并调整总营养
    this.adjustTotalNutrition(optimizedPlan, nutritionNeeds);

    // 2. 确保食物多样性
    this.ensureFoodVariety(optimizedPlan);

    // 3. 检查饮食限制
    this.validateRestrictions(optimizedPlan, restrictions);

    // 4. 平衡每餐营养
    this.balanceMealNutrition(optimizedPlan);

    // 5. 优化食物组合
    this.optimizeFoodCombinations(optimizedPlan);

    return optimizedPlan;
  }

  private adjustTotalNutrition(plan: MealPlan, needs: any): void {
    // TODO: 实现总营养调整
  }

  private ensureFoodVariety(plan: MealPlan): void {
    // TODO: 实现食物多样性确保
  }

  private validateRestrictions(plan: MealPlan, restrictions: DietaryRestriction[]): void {
    // TODO: 实现饮食限制验证
  }

  private balanceMealNutrition(plan: MealPlan): void {
    // TODO: 实现餐食营养平衡
  }

  private optimizeFoodCombinations(plan: MealPlan): void {
    // TODO: 实现食物组合优化
  }

  private validateAdjustments(plan: MealPlan, adjustments: any): { valid: boolean; reason?: string } {
    // TODO: 实现调整验证
    return { valid: true };
  }

  private applyAdjustments(plan: MealPlan, adjustments: any): MealPlan {
    // TODO: 实现调整应用
    return plan;
  }

  private reoptimizePlan(plan: MealPlan): MealPlan {
    // TODO: 实现计划重新优化
    return plan;
  }

  private calculateTotalNutrition(plan: MealPlan): void {
    const total = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0
    };

    plan.days.forEach(day => {
      Object.values(day.meals).forEach(mealFoods => {
        mealFoods.forEach(food => {
          Object.keys(total).forEach(nutrient => {
            total[nutrient] += food.nutrients[nutrient] || 0;
          });
        });
      });
    });

    plan.totalNutrition = total;
  }

  private async saveMealPlan(userId: string, plan: MealPlan): Promise<void> {
    await this.mongo.collection('meal_plans').insertOne({
      user_id: userId,
      plan,
      created_at: new Date()
    });
  }

  private async updateMealPlan(userId: string, plan: MealPlan): Promise<void> {
    await this.mongo.collection('meal_plans').updateOne(
      { user_id: userId },
      {
        $set: {
          plan,
          updated_at: new Date()
        }
      }
    );
  }
