import { IHealthData } from '../types/health.types';
import { Injectable } from '@nestjs/common';
import { Logger } from './logger';

@Injectable()
export class DataCleaner {
  private readonly logger = new Logger(DataCleaner.name);

  /**
   * 清洗健康数据
   */
  cleanHealthData(data: IHealthData): IHealthData {
    try {
      return {
        ...data,
        physicalData: this.cleanPhysicalData(data.physicalData),
        mentalData: this.cleanMentalData(data.mentalData),
        nutritionData: this.cleanNutritionData(data.nutritionData),
        lifestyleData: this.cleanLifestyleData(data.lifestyleData),
      };
    } catch (error) {
      this.logger.error('数据清洗失败', error);
      throw error;
    }
  }

  /**
   * 清洗物理数据
   */
  private cleanPhysicalData(data: IHealthData['physicalData']): IHealthData['physicalData'] {
    return {
      ...data,
      // 移除异常值
      height: this.removeOutlier(data.height, 0, 300),
      weight: this.removeOutlier(data.weight, 0, 500),
      bloodPressure: {
        systolic: this.removeOutlier(data.bloodPressure.systolic, 70, 200),
        diastolic: this.removeOutlier(data.bloodPressure.diastolic, 40, 130),
      },
      heartRate: this.removeOutlier(data.heartRate, 40, 200),
      bodyTemperature: this.removeOutlier(data.bodyTemperature, 35, 42),
      bloodOxygen: this.removeOutlier(data.bloodOxygen, 80, 100),
    };
  }

  /**
   * 清洗心理数据
   */
  private cleanMentalData(data: IHealthData['mentalData']): IHealthData['mentalData'] {
    return {
      ...data,
      // 标准化评分
      stressLevel: this.normalizeScore(data.stressLevel),
      moodScore: this.normalizeScore(data.moodScore),
      sleepQuality: this.normalizeScore(data.sleepQuality),
    };
  }

  /**
   * 清洗营养数据
   */
  private cleanNutritionData(data: IHealthData['nutritionData']): IHealthData['nutritionData'] {
    return {
      ...data,
      // 移除异常值
      calorieIntake: this.removeOutlier(data.calorieIntake, 0, 10000),
      waterIntake: this.removeOutlier(data.waterIntake, 0, 10000),
      // 清洗餐食数据
      meals: this.cleanMeals(data.meals),
    };
  }

  /**
   * 清洗生活方式数据
   */
  private cleanLifestyleData(data: IHealthData['lifestyleData']): IHealthData['lifestyleData'] {
    return {
      ...data,
      // 移除异常值
      sleepHours: this.removeOutlier(data.sleepHours, 0, 24),
      activityLevel: this.normalizeScore(data.activityLevel),
      // 清洗活动数据
      activities: this.cleanActivities(data.activities),
    };
  }

  /**
   * 清洗餐食数据
   */
  private cleanMeals(
    meals: IHealthData['nutritionData']['meals'],
  ): IHealthData['nutritionData']['meals'] {
    return (
      meals
        // 移除无效餐食
        .filter(meal => meal.type && meal.time && meal.items && meal.items.length > 0)
        // 清洗每个餐食
        .map(meal => ({
          ...meal,
          // 标准化餐食类型
          type: this.standardizeMealType(meal.type),
          // 清洗餐食项目
          items: meal.items
            // 移除无效项目
            .filter(item => item.name && item.amount > 0 && item.calories >= 0)
            // 清洗每个项目
            .map(item => ({
              ...item,
              // 标准化数值
              amount: Math.max(0, item.amount),
              calories: Math.max(0, item.calories),
            })),
        }))
        // 按时间排序
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    );
  }

  /**
   * 清洗活动数据
   */
  private cleanActivities(
    activities: IHealthData['lifestyleData']['activities'],
  ): IHealthData['lifestyleData']['activities'] {
    return (
      activities
        // 移除无效活动
        .filter(activity => activity.type && activity.duration >= 0 && activity.intensity >= 0)
        // 清洗每个活动
        .map(activity => ({
          ...activity,
          // 标准化活动类型
          type: this.standardizeActivityType(activity.type),
          // 标准化数值
          duration: this.removeOutlier(activity.duration, 0, 1440),
          intensity: this.normalizeScore(activity.intensity),
          caloriesBurned: Math.max(0, activity.caloriesBurned),
        }))
        // 按持续时间排序
        .sort((a, b) => b.duration - a.duration)
    );
  }

  /**
   * 移除异常值
   */
  private removeOutlier(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  /**
   * 标准化评分(0-10)
   */
  private normalizeScore(score: number): number {
    return this.removeOutlier(score, 0, 10);
  }

  /**
   * 标准化餐食类型
   */
  private standardizeMealType(type: string): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
    type = type.toLowerCase().trim();

    switch (type) {
      case 'breakfast':
      case 'morning':
      case '早餐':
        return 'breakfast';
      case 'lunch':
      case 'noon':
      case '午餐':
        return 'lunch';
      case 'dinner':
      case 'evening':
      case '晚餐':
        return 'dinner';
      default:
        return 'snack';
    }
  }

  /**
   * 标准化活动类型
   */
  private standardizeActivityType(type: string): string {
    type = type.toLowerCase().trim();

    const activityMap: { [key: string]: string } = {
      walk: 'walking',
      walking: 'walking',
      步行: 'walking',
      散步: 'walking',

      run: 'running',
      running: 'running',
      跑步: 'running',
      慢跑: 'running',

      cycle: 'cycling',
      cycling: 'cycling',
      bike: 'cycling',
      骑行: 'cycling',
      自行车: 'cycling',

      swim: 'swimming',
      swimming: 'swimming',
      游泳: 'swimming',

      yoga: 'yoga',
      瑜伽: 'yoga',

      gym: 'gym',
      workout: 'gym',
      健身: 'gym',
      力量训练: 'gym',
    };

    return activityMap[type] || 'other';
  }
}
