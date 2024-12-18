import {
  IUserProfile,
  IExerciseRecommendation,
  IDietRecommendation,
  ILifestyleRecommendation,
  IHealthCondition,
  IUserCapability,
  IAllergy,
  IUserSchedule,
  IRecommendationContext,
  IRecommendationResult,
} from '@shared/types/health';
import { AIModelManager } from '@models/ai-model-manager';
import { CacheManager } from '@utils/cache-manager';
import { DataProcessor } from '@utils/data-processor';
import { Injectable } from '@nestjs/common';
import { Logger } from '@utils/logger';
@Injectable()
export class UnifiedRecommendationService {
  private readonly logger = new Logger(UnifiedRecommendationService.name);

  constructor(
    private readonly aiModelManager: AIModelManager,
    private readonly cacheManager: CacheManager,
    private readonly dataProcessor: DataProcessor,
  ) {}

  /**
   * 生成健康推荐
   * @param userId 用户ID
   * @param context 推荐上下文
   */
  public async generateRecommendations(
    userId: string,
    context: IRecommendationContext,
  ): Promise<IRecommendationResult> {
    try {
      this.logger.info('开始生成健康推荐', { userId, context });

      // 尝试从缓存获取推荐结果
      const cacheKey = `recommendations:${userId}:${JSON.stringify(context)}`;
      const cachedResult = await this.cacheManager.get(cacheKey);
      if (cachedResult) {
        this.logger.info('使用缓存的推荐结果', { userId });
        return cachedResult;
      }

      // 获取用户画像
      const userProfile = await this.getUserProfile(userId);

      // 生成各类推荐
      const [exerciseRecs, dietRecs, lifestyleRecs] = await Promise.all([
        this.generateExerciseRecommendations(userProfile, context),
        this.generateDietRecommendations(userProfile, context),
        this.generateLifestyleRecommendations(userProfile, context),
      ]);

      // 整合推荐结果
      const result: IRecommendationResult = {
        userId,
        timestamp: new Date().toISOString(),
        exercise: exerciseRecs,
        diet: dietRecs,
        lifestyle: lifestyleRecs,
        context: {
          ...context,
          userProfile: {
            age: userProfile.age,
            gender: userProfile.gender,
            activityLevel: userProfile.activityLevel,
            healthGoals: userProfile.healthGoals,
          },
        },
      };

      // 缓存推荐结果
      await this.cacheManager.set(
        cacheKey,
        result,
        Number(process.env.RECOMMENDATION_CACHE_TTL) || 3600,
      );

      this.logger.info('健康推荐生成完成', { userId });
      return result;
    } catch (error) {
      this.logger.error('健康推荐生成失败', error);
      throw error;
    }
  }

  /**
   * 生成运动推荐
   */
  private async generateExerciseRecommendations(
    profile: IUserProfile,
    context: IRecommendationContext,
  ): Promise<IExerciseRecommendation[]> {
    try {
      // 使用AI模型生成初始推荐
      const modelResult = await this.aiModelManager.predict('exercise-recommendation', {
        profile,
        context,
      });

      // 调整推荐以适应健康状况
      let recommendations = this.adjustForConditions(
        modelResult.recommendations,
        profile.healthConditions,
      );

      // 验证运动强度是否适合用户能力
      recommendations = recommendations.filter(rec =>
        this.validateIntensity(rec, profile.capabilities),
      );

      // 根据天气调整户外运动建议
      recommendations = this.adjustForWeather(recommendations, context.weather);

      // 根据时间段调整运动类型
      recommendations = this.adjustForTimeOfDay(recommendations, context.timeOfDay);

      return recommendations;
    } catch (error) {
      this.logger.error('运动推荐生成失败', error);
      throw error;
    }
  }

  /**
   * 生成饮食推荐
   */
  private async generateDietRecommendations(
    profile: IUserProfile,
    context: IRecommendationContext,
  ): Promise<IDietRecommendation[]> {
    try {
      // 使用AI模型生成初始推荐
      const modelResult = await this.aiModelManager.predict('diet-recommendation', {
        profile,
        context,
      });

      // 考虑过敏情况
      let recommendations = this.considerAllergies(modelResult.recommendations, profile.allergies);

      // 平衡营养摄入
      recommendations = this.balanceNutrition(recommendations);

      // 根据季节调整食材
      recommendations = this.adjustForSeason(recommendations, context.season);

      // 根据用餐时间调整
      recommendations = this.adjustForMealTime(recommendations, context.timeOfDay);

      return recommendations;
    } catch (error) {
      this.logger.error('饮食推荐生成失败', error);
      throw error;
    }
  }

  /**
   * 生成生活方式推荐
   */
  private async generateLifestyleRecommendations(
    profile: IUserProfile,
    context: IRecommendationContext,
  ): Promise<ILifestyleRecommendation[]> {
    try {
      // 使用AI模型生成初始推荐
      const modelResult = await this.aiModelManager.predict('lifestyle-recommendation', {
        profile,
        context,
      });

      // 优先级排序
      let recommendations = this.prioritizeRecommendations(modelResult.recommendations);

      // 适应用户日程
      recommendations = this.adaptToSchedule(recommendations, profile.schedule);

      // 根据季节调整建议
      recommendations = this.adjustForSeason(recommendations, context.season);

      // 考虑工作和休息时间
      recommendations = this.adjustForWorkRestPattern(recommendations, profile.schedule);

      return recommendations;
    } catch (error) {
      this.logger.error('生活方式推荐生成失败', error);
      throw error;
    }
  }

  /**
   * 获取用户画像
   */
  private async getUserProfile(userId: string): Promise<IUserProfile> {
    try {
      // 从缓存获取用户画像
      const cacheKey = `user-profile:${userId}`;
      const cachedProfile = await this.cacheManager.get(cacheKey);
      if (cachedProfile) {
        return cachedProfile;
      }

      // TODO: 从数据库获取用户画像
      // 这里临时返回模拟数据
      const profile: IUserProfile = {
        id: userId,
        age: 30,
        gender: 'male',
        height: 175,
        weight: 70,
        activityLevel: 'moderate',
        healthGoals: ['weight-maintenance', 'fitness-improvement'],
        healthConditions: [],
        allergies: [],
        capabilities: {
          cardio: 'moderate',
          strength: 'moderate',
          flexibility: 'moderate',
          balance: 'good',
        },
        schedule: {
          workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workHours: { start: '09:00', end: '18:00' },
          preferredExerciseTime: { start: '18:30', end: '20:00' },
          mealTimes: {
            breakfast: '08:00',
            lunch: '12:30',
            dinner: '19:00',
          },
        },
      };

      // 缓存用户画像
      await this.cacheManager.set(
        cacheKey,
        profile,
        Number(process.env.USER_PROFILE_CACHE_TTL) || 3600,
      );

      return profile;
    } catch (error) {
      this.logger.error('获取用户画像失败', error);
      throw error;
    }
  }

  /**
   * 根据健康状况调整运动推荐
   */
  private adjustForConditions(
    recommendations: IExerciseRecommendation[],
    conditions: IHealthCondition[],
  ): IExerciseRecommendation[] {
    if (!conditions || conditions.length === 0) {
      return recommendations;
    }

    return recommendations.filter(rec => {
      // 检查每个健康状况的限制
      for (const condition of conditions) {
        if (this.isExerciseContraindicated(rec.type, condition)) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * 检查运动是否禁忌
   */
  private isExerciseContraindicated(exerciseType: string, condition: IHealthCondition): boolean {
    // 定义运动禁忌对照表
    const contraindications: { [key: string]: string[] } = {
      'heart-disease': ['high-intensity', 'weightlifting', 'sprinting'],
      hypertension: ['high-intensity', 'inverted-poses'],
      'back-pain': ['heavy-lifting', 'high-impact', 'twisting'],
      'joint-pain': ['high-impact', 'jumping', 'running'],
    };

    return contraindications[condition.name]?.includes(exerciseType) || false;
  }

  /**
   * 验证运动强度是否适合
   */
  private validateIntensity(
    recommendation: IExerciseRecommendation,
    capability: IUserCapability,
  ): boolean {
    // 定义强度等级对照表
    const intensityLevels: { [key: string]: number } = {
      low: 1,
      moderate: 2,
      high: 3,
    };

    // 定义能力等级对照表
    const capabilityLevels: { [key: string]: number } = {
      poor: 1,
      moderate: 2,
      good: 3,
      excellent: 4,
    };

    const recommendedIntensity = intensityLevels[recommendation.intensity];
    const userCapability = capabilityLevels[capability[recommendation.primaryCapability]];

    // 确保推荐的强度不超过用户能力
    return recommendedIntensity <= userCapability;
  }

  /**
   * 根据天气调整运动建议
   */
  private adjustForWeather(
    recommendations: IExerciseRecommendation[],
    weather: string,
  ): IExerciseRecommendation[] {
    const indoorAlternatives: { [key: string]: string } = {
      running: 'treadmill',
      cycling: 'stationary-bike',
      swimming: 'indoor-pool',
      hiking: 'stair-climbing',
    };

    if (['rainy', 'snowy', 'stormy'].includes(weather)) {
      return recommendations.map(rec => {
        if (rec.location === 'outdoor') {
          return {
            ...rec,
            type: indoorAlternatives[rec.type] || rec.type,
            location: 'indoor',
            notes: `Due to ${weather} weather, switched to indoor alternative`,
          };
        }
        return rec;
      });
    }

    return recommendations;
  }

  /**
   * 根据时间调整运动类型
   */
  private adjustForTimeOfDay(
    recommendations: IExerciseRecommendation[],
    timeOfDay: string,
  ): IExerciseRecommendation[] {
    const timeBasedAdjustments: { [key: string]: any } = {
      'early-morning': {
        preferred: ['yoga', 'stretching', 'light-cardio'],
        intensity: 'moderate',
      },
      morning: {
        preferred: ['running', 'cycling', 'swimming'],
        intensity: 'high',
      },
      afternoon: {
        preferred: ['weightlifting', 'sports', 'cardio'],
        intensity: 'high',
      },
      evening: {
        preferred: ['walking', 'light-yoga', 'stretching'],
        intensity: 'low',
      },
    };

    const adjustment = timeBasedAdjustments[timeOfDay];
    if (!adjustment) {
      return recommendations;
    }

    return recommendations.map(rec => ({
      ...rec,
      intensity: rec.type === 'high-intensity' ? adjustment.intensity : rec.intensity,
      priority: adjustment.preferred.includes(rec.type) ? rec.priority + 1 : rec.priority,
    }));
  }

  /**
   * 考虑过敏情况
   */
  private considerAllergies(
    recommendations: IDietRecommendation[],
    allergies: IAllergy[],
  ): IDietRecommendation[] {
    if (!allergies || allergies.length === 0) {
      return recommendations;
    }

    const allergyIngredients = allergies.map(allergy => allergy.ingredient.toLowerCase());

    return recommendations.map(rec => ({
      ...rec,
      foods: rec.foods.filter(
        food => !allergyIngredients.some(allergen => food.toLowerCase().includes(allergen)),
      ),
      notes: [...(rec.notes || []), '已考虑过敏原进行调整'],
    }));
  }

  /**
   * 平衡营养摄入
   */
  private balanceNutrition(recommendations: IDietRecommendation[]): IDietRecommendation[] {
    const dailyNutrients = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    // 计算总营养摄入
    recommendations.forEach(rec => {
      dailyNutrients.calories += rec.nutrients.calories;
      dailyNutrients.protein += rec.nutrients.protein;
      dailyNutrients.carbs += rec.nutrients.carbs;
      dailyNutrients.fat += rec.nutrients.fat;
    });

    // 调整建议以达到理想的营养比例
    return recommendations.map(rec => {
      const adjustedNutrients = {
        calories: rec.nutrients.calories,
        protein: rec.nutrients.protein,
        carbs: rec.nutrients.carbs,
        fat: rec.nutrients.fat,
      };

      // 如果总蛋白质摄入不足，增加高蛋白食物
      if (dailyNutrients.protein < (0.8 * dailyNutrients.calories) / 4) {
        adjustedNutrients.protein *= 1.2;
      }

      // 如果碳水化合物比例过高，减少碳水食物
      if (dailyNutrients.carbs > (0.6 * dailyNutrients.calories) / 4) {
        adjustedNutrients.carbs *= 0.8;
      }

      return {
        ...rec,
        nutrients: adjustedNutrients,
        notes: [...(rec.notes || []), '已调整营养比例'],
      };
    });
  }

  /**
   * 根据季节调整建议
   */
  private adjustForSeason(recommendations: any[], season: string): any[] {
    const seasonalAdjustments: { [key: string]: any } = {
      spring: {
        foods: ['leafy-greens', 'asparagus', 'peas'],
        activities: ['outdoor-walking', 'gardening', 'cycling'],
      },
      summer: {
        foods: ['berries', 'tomatoes', 'cucumber'],
        activities: ['swimming', 'morning-exercise', 'evening-walks'],
      },
      autumn: {
        foods: ['pumpkin', 'apples', 'root-vegetables'],
        activities: ['hiking', 'outdoor-yoga', 'running'],
      },
      winter: {
        foods: ['citrus', 'winter-squash', 'root-vegetables'],
        activities: ['indoor-exercise', 'hot-yoga', 'indoor-swimming'],
      },
    };

    const adjustment = seasonalAdjustments[season];
    if (!adjustment) {
      return recommendations;
    }

    return recommendations.map(rec => {
      if (rec.type === 'diet') {
        return {
          ...rec,
          foods: [...rec.foods, ...adjustment.foods],
          notes: [...(rec.notes || []), `已根据${season}季节特点调整`],
        };
      }
      if (rec.type === 'activity') {
        return {
          ...rec,
          activities: adjustment.activities.includes(rec.activity)
            ? { ...rec.activity, priority: rec.priority + 1 }
            : rec.activity,
          notes: [...(rec.notes || []), `已根据${season}季节特点调整`],
        };
      }
      return rec;
    });
  }

  /**
   * 根据用餐时间调整
   */
  private adjustForMealTime(
    recommendations: IDietRecommendation[],
    timeOfDay: string,
  ): IDietRecommendation[] {
    const mealTimeAdjustments: { [key: string]: any } = {
      'early-morning': {
        preferred: ['light', 'protein-rich', 'easy-digest'],
        avoid: ['heavy', 'spicy', 'fatty'],
      },
      morning: {
        preferred: ['protein-rich', 'whole-grain', 'fruit'],
        avoid: ['heavy', 'processed'],
      },
      noon: {
        preferred: ['balanced', 'protein', 'vegetables'],
        avoid: ['very-heavy', 'high-sugar'],
      },
      afternoon: {
        preferred: ['light', 'protein-snack', 'fruit'],
        avoid: ['heavy', 'high-carb'],
      },
      evening: {
        preferred: ['light-protein', 'vegetables', 'easy-digest'],
        avoid: ['heavy', 'high-carb', 'spicy'],
      },
    };

    const adjustment = mealTimeAdjustments[timeOfDay];
    if (!adjustment) {
      return recommendations;
    }

    return recommendations.map(rec => ({
      ...rec,
      foods: rec.foods.filter(
        food => !adjustment.avoid.some((avoid: string) => food.toLowerCase().includes(avoid)),
      ),
      priority: adjustment.preferred.some((pref: string) =>
        rec.foods.some(food => food.toLowerCase().includes(pref)),
      )
        ? rec.priority + 1
        : rec.priority,
      notes: [...(rec.notes || []), `已根据${timeOfDay}时段调整`],
    }));
  }

  /**
   * 优先级排序
   */
  private prioritizeRecommendations(recommendations: any[]): any[] {
    return recommendations.sort((a, b) => {
      // 首先按优先级排序
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // 其次按时效性排序
      if (a.validUntil && b.validUntil) {
        return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
      }
      return 0;
    });
  }

  /**
   * 适应用户日程
   */
  private adaptToSchedule(
    recommendations: ILifestyleRecommendation[],
    schedule: IUserSchedule,
  ): ILifestyleRecommendation[] {
    return recommendations.map(rec => {
      // 检查建议的时间是否与用户日程冲突
      const timeSlot = this.findSuitableTimeSlot(rec, schedule);

      return {
        ...rec,
        suggestedTime: timeSlot,
        notes: [...(rec.notes || []), '已根据个人日程调整时间'],
      };
    });
  }

  /**
   * 寻找合适的时间段
   */
  private findSuitableTimeSlot(
    recommendation: ILifestyleRecommendation,
    schedule: IUserSchedule,
  ): string {
    // 获取活动所需时间
    const duration = recommendation.duration || 30; // 默认30分钟

    // 检查首选时间段是否可用
    if (recommendation.preferredTime) {
      if (this.isTimeSlotAvailable(recommendation.preferredTime, duration, schedule)) {
        return recommendation.preferredTime;
      }
    }

    // 寻找其他可用时间段
    const availableSlots = this.findAvailableTimeSlots(duration, schedule);

    if (availableSlots.length > 0) {
      // 返回第一个可用时间段
      return availableSlots[0];
    }

    // 如果没有找到合适的时间段，返回建议的替代时间
    return this.suggestAlternativeTime(recommendation, schedule);
  }

  /**
   * 检查时间段是否可用
   */
  private isTimeSlotAvailable(time: string, duration: number, schedule: IUserSchedule): boolean {
    const timeDate = new Date(`1970-01-01T${time}`);
    const endTime = new Date(timeDate.getTime() + duration * 60000);

    // 检查是否在工作时间
    const workStart = new Date(`1970-01-01T${schedule.workHours.start}`);
    const workEnd = new Date(`1970-01-01T${schedule.workHours.end}`);

    if (timeDate >= workStart && endTime <= workEnd) {
      return false;
    }

    // 检查是否与其他固定活动时间冲突
    const fixedTimes = [
      schedule.mealTimes.breakfast,
      schedule.mealTimes.lunch,
      schedule.mealTimes.dinner,
    ];

    for (const fixedTime of fixedTimes) {
      const fixed = new Date(`1970-01-01T${fixedTime}`);
      const fixedEnd = new Date(fixed.getTime() + 30 * 60000); // 假设用餐时间30分钟

      if ((timeDate >= fixed && timeDate < fixedEnd) || (endTime > fixed && endTime <= fixedEnd)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 寻找可用时间段
   */
  private findAvailableTimeSlots(duration: number, schedule: IUserSchedule): string[] {
    const slots: string[] = [];
    const day = new Date('1970-01-01');
    const endOfDay = new Date('1970-01-02');

    while (day < endOfDay) {
      const timeSlot = day.toTimeString().slice(0, 5);
      if (this.isTimeSlotAvailable(timeSlot, duration, schedule)) {
        slots.push(timeSlot);
      }
      day.setMinutes(day.getMinutes() + 30); // 每30分钟检查一次
    }

    return slots;
  }

  /**
   * 建议替代时间
   */
  private suggestAlternativeTime(
    recommendation: ILifestyleRecommendation,
    schedule: IUserSchedule,
  ): string {
    // 如果是运动建议，优先考虑清晨或下班后
    if (recommendation.category === 'exercise') {
      const morningSlot = '06:00';
      const eveningSlot = '19:00';

      if (this.isTimeSlotAvailable(morningSlot, recommendation.duration || 30, schedule)) {
        return morningSlot;
      }
      return eveningSlot;
    }

    // 如果是放松活动，建议在晚上
    if (recommendation.category === 'relaxation') {
      return '21:00';
    }

    // 默认建议时间
    return '18:00';
  }

  /**
   * 根据工作休息模式调整
   */
  private adjustForWorkRestPattern(
    recommendations: ILifestyleRecommendation[],
    schedule: IUserSchedule,
  ): ILifestyleRecommendation[] {
    return recommendations.map(rec => {
      // 如果是工作日
      if (schedule.workDays.includes(rec.day.toLowerCase())) {
        return {
          ...rec,
          intensity: rec.intensity === 'high' ? 'moderate' : rec.intensity,
          duration: Math.min(rec.duration || 30, 60), // 限制持续时间
          notes: [...(rec.notes || []), '已考虑工作日强度和时间限制'],
        };
      }

      // 如果是休息日，可以建议更长时间的活动
      return {
        ...rec,
        duration: rec.duration ? rec.duration * 1.5 : 45, // 增加持续时间
        notes: [...(rec.notes || []), '休息日活动时间可适当延长'],
      };
    });
  }
}
