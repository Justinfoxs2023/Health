import { IHealthData } from '../types/health.types';
import { IValidationResult, IValidationError } from '../types/data-processor.types';
import { Injectable } from '@nestjs/common';
import { Logger } from './logger';

@Injectable()
export class DataValidator {
  private readonly logger = new Logger(DataValidator.name);

  /**
   * 验证健康数据
   */
  validateHealthData(data: IHealthData): IValidationResult {
    try {
      const errors: IValidationError[] = [];

      // 验证必填字段
      this.validateRequiredFields(data, errors);

      // 验证数值范围
      this.validateRanges(data, errors);

      // 验证数据一致性
      this.validateConsistency(data, errors);

      // 验证数据格式
      this.validateFormat(data, errors);

      return {
        isValid: errors.length === 0,
        errors,
      };
    } catch (error) {
      this.logger.error('数据验证失败', error);
      throw error;
    }
  }

  /**
   * 验证必填字段
   */
  private validateRequiredFields(data: IHealthData, errors: IValidationError[]): void {
    // 验证用户ID
    if (!data.userId) {
      errors.push({
        field: 'userId',
        message: '用户ID是必需的',
        code: 'REQUIRED_FIELD_MISSING',
      });
    }

    // 验证时间戳
    if (!data.timestamp) {
      errors.push({
        field: 'timestamp',
        message: '时间戳是必需的',
        code: 'REQUIRED_FIELD_MISSING',
      });
    }

    // 验证物理数据
    if (!data.physicalData) {
      errors.push({
        field: 'physicalData',
        message: '物理数据是必需的',
        code: 'REQUIRED_FIELD_MISSING',
      });
    } else {
      this.validatePhysicalData(data.physicalData, errors);
    }

    // 验证心理数据
    if (!data.mentalData) {
      errors.push({
        field: 'mentalData',
        message: '心理数据是必需的',
        code: 'REQUIRED_FIELD_MISSING',
      });
    } else {
      this.validateMentalData(data.mentalData, errors);
    }

    // 验证营养数据
    if (!data.nutritionData) {
      errors.push({
        field: 'nutritionData',
        message: '营养数据是必需的',
        code: 'REQUIRED_FIELD_MISSING',
      });
    } else {
      this.validateNutritionData(data.nutritionData, errors);
    }

    // 验证生活方式数据
    if (!data.lifestyleData) {
      errors.push({
        field: 'lifestyleData',
        message: '生活方式数据是必需的',
        code: 'REQUIRED_FIELD_MISSING',
      });
    } else {
      this.validateLifestyleData(data.lifestyleData, errors);
    }
  }

  /**
   * 验证物理数据
   */
  private validatePhysicalData(
    data: IHealthData['physicalData'],
    errors: IValidationError[],
  ): void {
    const requiredFields = [
      'height',
      'weight',
      'bloodPressure',
      'heartRate',
      'bodyTemperature',
      'bloodOxygen',
    ];

    requiredFields.forEach(field => {
      if (!(field in data)) {
        errors.push({
          field: `physicalData.${field}`,
          message: `${field}是必需的`,
          code: 'REQUIRED_FIELD_MISSING',
        });
      }
    });

    if (data.bloodPressure) {
      if (!('systolic' in data.bloodPressure)) {
        errors.push({
          field: 'physicalData.bloodPressure.systolic',
          message: '收缩压是必需的',
          code: 'REQUIRED_FIELD_MISSING',
        });
      }
      if (!('diastolic' in data.bloodPressure)) {
        errors.push({
          field: 'physicalData.bloodPressure.diastolic',
          message: '舒张压是必需的',
          code: 'REQUIRED_FIELD_MISSING',
        });
      }
    }
  }

  /**
   * 验证心理数据
   */
  private validateMentalData(data: IHealthData['mentalData'], errors: IValidationError[]): void {
    const requiredFields = ['stressLevel', 'moodScore', 'sleepQuality'];

    requiredFields.forEach(field => {
      if (!(field in data)) {
        errors.push({
          field: `mentalData.${field}`,
          message: `${field}是必需的`,
          code: 'REQUIRED_FIELD_MISSING',
        });
      }
    });
  }

  /**
   * 验证营养数据
   */
  private validateNutritionData(
    data: IHealthData['nutritionData'],
    errors: IValidationError[],
  ): void {
    const requiredFields = ['calorieIntake', 'waterIntake', 'meals'];

    requiredFields.forEach(field => {
      if (!(field in data)) {
        errors.push({
          field: `nutritionData.${field}`,
          message: `${field}是必需的`,
          code: 'REQUIRED_FIELD_MISSING',
        });
      }
    });

    if (data.meals) {
      data.meals.forEach((meal, index) => {
        if (!meal.type) {
          errors.push({
            field: `nutritionData.meals[${index}].type`,
            message: '餐食类型是必需的',
            code: 'REQUIRED_FIELD_MISSING',
          });
        }
        if (!meal.time) {
          errors.push({
            field: `nutritionData.meals[${index}].time`,
            message: '餐食时间是必需的',
            code: 'REQUIRED_FIELD_MISSING',
          });
        }
        if (!meal.items || meal.items.length === 0) {
          errors.push({
            field: `nutritionData.meals[${index}].items`,
            message: '餐食项目是必需的',
            code: 'REQUIRED_FIELD_MISSING',
          });
        }
      });
    }
  }

  /**
   * 验证生活方式数据
   */
  private validateLifestyleData(
    data: IHealthData['lifestyleData'],
    errors: IValidationError[],
  ): void {
    const requiredFields = ['sleepHours', 'activityLevel', 'activities'];

    requiredFields.forEach(field => {
      if (!(field in data)) {
        errors.push({
          field: `lifestyleData.${field}`,
          message: `${field}是必需的`,
          code: 'REQUIRED_FIELD_MISSING',
        });
      }
    });

    if (data.activities) {
      data.activities.forEach((activity, index) => {
        if (!activity.type) {
          errors.push({
            field: `lifestyleData.activities[${index}].type`,
            message: '活动类型是必需的',
            code: 'REQUIRED_FIELD_MISSING',
          });
        }
        if (!('duration' in activity)) {
          errors.push({
            field: `lifestyleData.activities[${index}].duration`,
            message: '活动时长是必需的',
            code: 'REQUIRED_FIELD_MISSING',
          });
        }
        if (!('intensity' in activity)) {
          errors.push({
            field: `lifestyleData.activities[${index}].intensity`,
            message: '活动强度是必需的',
            code: 'REQUIRED_FIELD_MISSING',
          });
        }
      });
    }
  }

  /**
   * 验证数值范围
   */
  private validateRanges(data: IHealthData, errors: IValidationError[]): void {
    // 验证物理数据范围
    if (data.physicalData) {
      if (data.physicalData.height < 0 || data.physicalData.height > 300) {
        errors.push({
          field: 'physicalData.height',
          message: '身高必须在0-300cm之间',
          code: 'VALUE_OUT_OF_RANGE',
        });
      }

      if (data.physicalData.weight < 0 || data.physicalData.weight > 500) {
        errors.push({
          field: 'physicalData.weight',
          message: '体重必须在0-500kg之间',
          code: 'VALUE_OUT_OF_RANGE',
        });
      }

      if (data.physicalData.bloodPressure) {
        if (
          data.physicalData.bloodPressure.systolic < 70 ||
          data.physicalData.bloodPressure.systolic > 200
        ) {
          errors.push({
            field: 'physicalData.bloodPressure.systolic',
            message: '收缩压必须在70-200mmHg之间',
            code: 'VALUE_OUT_OF_RANGE',
          });
        }

        if (
          data.physicalData.bloodPressure.diastolic < 40 ||
          data.physicalData.bloodPressure.diastolic > 130
        ) {
          errors.push({
            field: 'physicalData.bloodPressure.diastolic',
            message: '舒张压必须在40-130mmHg之间',
            code: 'VALUE_OUT_OF_RANGE',
          });
        }
      }

      if (data.physicalData.heartRate < 40 || data.physicalData.heartRate > 200) {
        errors.push({
          field: 'physicalData.heartRate',
          message: '心率必须在40-200bpm之间',
          code: 'VALUE_OUT_OF_RANGE',
        });
      }

      if (data.physicalData.bodyTemperature < 35 || data.physicalData.bodyTemperature > 42) {
        errors.push({
          field: 'physicalData.bodyTemperature',
          message: '体温必须在35-42°C之间',
          code: 'VALUE_OUT_OF_RANGE',
        });
      }

      if (data.physicalData.bloodOxygen < 80 || data.physicalData.bloodOxygen > 100) {
        errors.push({
          field: 'physicalData.bloodOxygen',
          message: '血氧必须在80-100%之间',
          code: 'VALUE_OUT_OF_RANGE',
        });
      }
    }

    // 验证心理数据范围
    if (data.mentalData) {
      const mentalFields = ['stressLevel', 'moodScore', 'sleepQuality'];
      mentalFields.forEach(field => {
        if (data.mentalData[field] < 0 || data.mentalData[field] > 10) {
          errors.push({
            field: `mentalData.${field}`,
            message: `${field}必须在0-10之间`,
            code: 'VALUE_OUT_OF_RANGE',
          });
        }
      });
    }

    // 验证营养数据范围
    if (data.nutritionData) {
      if (data.nutritionData.calorieIntake < 0 || data.nutritionData.calorieIntake > 10000) {
        errors.push({
          field: 'nutritionData.calorieIntake',
          message: '卡路里摄入必须在0-10000kcal之间',
          code: 'VALUE_OUT_OF_RANGE',
        });
      }

      if (data.nutritionData.waterIntake < 0 || data.nutritionData.waterIntake > 10000) {
        errors.push({
          field: 'nutritionData.waterIntake',
          message: '饮水量必须在0-10000ml之间',
          code: 'VALUE_OUT_OF_RANGE',
        });
      }
    }

    // 验证生活方式数据范围
    if (data.lifestyleData) {
      if (data.lifestyleData.sleepHours < 0 || data.lifestyleData.sleepHours > 24) {
        errors.push({
          field: 'lifestyleData.sleepHours',
          message: '睡眠时长必须在0-24小时之间',
          code: 'VALUE_OUT_OF_RANGE',
        });
      }

      if (data.lifestyleData.activityLevel < 0 || data.lifestyleData.activityLevel > 10) {
        errors.push({
          field: 'lifestyleData.activityLevel',
          message: '活动水平必须在0-10之间',
          code: 'VALUE_OUT_OF_RANGE',
        });
      }

      data.lifestyleData.activities?.forEach((activity, index) => {
        if (activity.duration < 0 || activity.duration > 1440) {
          errors.push({
            field: `lifestyleData.activities[${index}].duration`,
            message: '活动时长必须在0-1440分钟之间',
            code: 'VALUE_OUT_OF_RANGE',
          });
        }

        if (activity.intensity < 0 || activity.intensity > 10) {
          errors.push({
            field: `lifestyleData.activities[${index}].intensity`,
            message: '活动强度必须在0-10之间',
            code: 'VALUE_OUT_OF_RANGE',
          });
        }
      });
    }
  }

  /**
   * 验证数据一致性
   */
  private validateConsistency(data: IHealthData, errors: IValidationError[]): void {
    // 验证血压一致性
    if (data.physicalData?.bloodPressure) {
      const { systolic, diastolic } = data.physicalData.bloodPressure;
      if (systolic <= diastolic) {
        errors.push({
          field: 'physicalData.bloodPressure',
          message: '收缩压必须大于舒张压',
          code: 'INCONSISTENT_DATA',
        });
      }
    }

    // 验证时间一致性
    if (data.nutritionData?.meals) {
      const now = new Date();
      data.nutritionData.meals.forEach((meal, index) => {
        const mealTime = new Date(meal.time);
        if (mealTime > now) {
          errors.push({
            field: `nutritionData.meals[${index}].time`,
            message: '餐食时间不能晚于当前时间',
            code: 'INCONSISTENT_DATA',
          });
        }
      });
    }

    // 验证卡路里一致性
    if (data.nutritionData?.meals && data.nutritionData?.calorieIntake) {
      const totalCalories = data.nutritionData.meals.reduce(
        (sum, meal) => sum + meal.items.reduce((mealSum, item) => mealSum + item.calories, 0),
        0,
      );

      if (Math.abs(totalCalories - data.nutritionData.calorieIntake) > 100) {
        errors.push({
          field: 'nutritionData',
          message: '总卡路里摄入与餐食卡路里不一致',
          code: 'INCONSISTENT_DATA',
        });
      }
    }
  }

  /**
   * 验证数据格式
   */
  private validateFormat(data: IHealthData, errors: IValidationError[]): void {
    // 验证用户ID格式
    if (data.userId && !/^[a-zA-Z0-9-_]+$/.test(data.userId)) {
      errors.push({
        field: 'userId',
        message: '用户ID格式无效',
        code: 'INVALID_FORMAT',
      });
    }

    // 验证时间戳格式
    if (data.timestamp && isNaN(new Date(data.timestamp).getTime())) {
      errors.push({
        field: 'timestamp',
        message: '时间戳格式无效',
        code: 'INVALID_FORMAT',
      });
    }

    // 验证活动类型格式
    if (data.lifestyleData?.activities) {
      const validActivityTypes = [
        'walking',
        'running',
        'cycling',
        'swimming',
        'yoga',
        'gym',
        'other',
      ];

      data.lifestyleData.activities.forEach((activity, index) => {
        if (!validActivityTypes.includes(activity.type)) {
          errors.push({
            field: `lifestyleData.activities[${index}].type`,
            message: '活动类型无效',
            code: 'INVALID_FORMAT',
          });
        }
      });
    }

    // 验证餐食类型格式
    if (data.nutritionData?.meals) {
      const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

      data.nutritionData.meals.forEach((meal, index) => {
        if (!validMealTypes.includes(meal.type)) {
          errors.push({
            field: `nutritionData.meals[${index}].type`,
            message: '餐食类型无效',
            code: 'INVALID_FORMAT',
          });
        }
      });
    }
  }
}
