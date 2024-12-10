import { Test, TestingModule } from '@nestjs/testing';
import { DataValidator } from '../data-validator';
import { HealthData } from '../../types/health.types';

describe('DataValidator', () => {
  let validator: DataValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataValidator],
    }).compile();

    validator = module.get<DataValidator>(DataValidator);
  });

  describe('validateHealthData', () => {
    it('应该验证有效的健康数据', () => {
      const validData: HealthData = {
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: 170,
          weight: 65,
          bloodPressure: {
            systolic: 120,
            diastolic: 80
          },
          heartRate: 75,
          bodyTemperature: 36.5,
          bloodOxygen: 98
        },
        mentalData: {
          stressLevel: 3,
          moodScore: 8,
          sleepQuality: 7
        },
        nutritionData: {
          calorieIntake: 2000,
          waterIntake: 2500,
          meals: [
            {
              type: 'breakfast',
              time: new Date(),
              items: [
                {
                  name: '牛奶',
                  amount: 250,
                  unit: 'ml',
                  calories: 150
                }
              ]
            }
          ]
        },
        lifestyleData: {
          sleepHours: 8,
          activityLevel: 7,
          activities: [
            {
              type: 'walking',
              duration: 30,
              intensity: 5,
              caloriesBurned: 150
            }
          ]
        }
      };

      const result = validator.validateHealthData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该检测到缺失的必填字段', () => {
      const invalidData: any = {
        userId: 'test-user',
        timestamp: new Date(),
        // 缺少 physicalData
        mentalData: {
          stressLevel: 3,
          moodScore: 8,
          sleepQuality: 7
        }
      };

      const result = validator.validateHealthData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'physicalData',
        message: '物理数据是必需的',
        code: 'REQUIRED_FIELD_MISSING'
      });
    });

    it('应该检���到数值范围错误', () => {
      const invalidData: HealthData = {
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: 400, // 超出范围
          weight: 65,
          bloodPressure: {
            systolic: 120,
            diastolic: 80
          },
          heartRate: 75,
          bodyTemperature: 36.5,
          bloodOxygen: 98
        },
        mentalData: {
          stressLevel: 3,
          moodScore: 8,
          sleepQuality: 7
        },
        nutritionData: {
          calorieIntake: 2000,
          waterIntake: 2500,
          meals: []
        },
        lifestyleData: {
          sleepHours: 8,
          activityLevel: 7,
          activities: []
        }
      };

      const result = validator.validateHealthData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'physicalData.height',
        message: '身高必须在0-300cm之间',
        code: 'VALUE_OUT_OF_RANGE'
      });
    });

    it('应该检测到数据一致性错误', () => {
      const invalidData: HealthData = {
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: 170,
          weight: 65,
          bloodPressure: {
            systolic: 80, // ��缩压小于舒张压
            diastolic: 90
          },
          heartRate: 75,
          bodyTemperature: 36.5,
          bloodOxygen: 98
        },
        mentalData: {
          stressLevel: 3,
          moodScore: 8,
          sleepQuality: 7
        },
        nutritionData: {
          calorieIntake: 2000,
          waterIntake: 2500,
          meals: []
        },
        lifestyleData: {
          sleepHours: 8,
          activityLevel: 7,
          activities: []
        }
      };

      const result = validator.validateHealthData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'physicalData.bloodPressure',
        message: '收缩压必须大于舒张压',
        code: 'INCONSISTENT_DATA'
      });
    });

    it('应该检测到格式错误', () => {
      const invalidData: HealthData = {
        userId: 'test user!', // 包含无效字符
        timestamp: new Date(),
        physicalData: {
          height: 170,
          weight: 65,
          bloodPressure: {
            systolic: 120,
            diastolic: 80
          },
          heartRate: 75,
          bodyTemperature: 36.5,
          bloodOxygen: 98
        },
        mentalData: {
          stressLevel: 3,
          moodScore: 8,
          sleepQuality: 7
        },
        nutritionData: {
          calorieIntake: 2000,
          waterIntake: 2500,
          meals: []
        },
        lifestyleData: {
          sleepHours: 8,
          activityLevel: 7,
          activities: [
            {
              type: 'invalid-type', // 无效的活动类型
              duration: 30,
              intensity: 5,
              caloriesBurned: 150
            }
          ]
        }
      };

      const result = validator.validateHealthData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'userId',
        message: '用户ID格式无效',
        code: 'INVALID_FORMAT'
      });
      expect(result.errors).toContainEqual({
        field: 'lifestyleData.activities[0].type',
        message: '活动类型无效',
        code: 'INVALID_FORMAT'
      });
    });
  });
}); 