import { DataCleaner } from '../data-cleaner';
import { IHealthData } from '../../types/health.types';
import { Test, TestingModule } from '@nestjs/testing';

describe('DataCleaner', () => {
  let cleaner: DataCleaner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataCleaner],
    }).compile();

    cleaner = module.get<DataCleaner>(DataCleaner);
  });

  describe('cleanHealthData', () => {
    it('应该清洗物理数据中的异常值', () => {
      const dirtyData: IHealthData = {
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: 400, // 超出范围
          weight: -10, // 无效值
          bloodPressure: {
            systolic: 250, // 超出范围
            diastolic: 20, // 低于范围
          },
          heartRate: 300, // 超出范围
          bodyTemperature: 45, // 超出范围
          bloodOxygen: 70, // 低于范围
        },
        mentalData: {
          stressLevel: 3,
          moodScore: 8,
          sleepQuality: 7,
        },
        nutritionData: {
          calorieIntake: 2000,
          waterIntake: 2500,
          meals: [],
        },
        lifestyleData: {
          sleepHours: 8,
          activityLevel: 7,
          activities: [],
        },
      };

      const cleanedData = cleaner.cleanHealthData(dirtyData);

      expect(cleanedData.physicalData.height).toBe(300); // 最大值
      expect(cleanedData.physicalData.weight).toBe(0); // 最小值
      expect(cleanedData.physicalData.bloodPressure.systolic).toBe(200);
      expect(cleanedData.physicalData.bloodPressure.diastolic).toBe(40);
      expect(cleanedData.physicalData.heartRate).toBe(200);
      expect(cleanedData.physicalData.bodyTemperature).toBe(42);
      expect(cleanedData.physicalData.bloodOxygen).toBe(80);
    });

    it('应该标准化评分数据', () => {
      const dirtyData: IHealthData = {
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: 170,
          weight: 65,
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
          },
          heartRate: 75,
          bodyTemperature: 36.5,
          bloodOxygen: 98,
        },
        mentalData: {
          stressLevel: 15, // 超出范围
          moodScore: -5, // 无效值
          sleepQuality: 12, // 超出范围
        },
        nutritionData: {
          calorieIntake: 2000,
          waterIntake: 2500,
          meals: [],
        },
        lifestyleData: {
          sleepHours: 8,
          activityLevel: 7,
          activities: [],
        },
      };

      const cleanedData = cleaner.cleanHealthData(dirtyData);

      expect(cleanedData.mentalData.stressLevel).toBe(10);
      expect(cleanedData.mentalData.moodScore).toBe(0);
      expect(cleanedData.mentalData.sleepQuality).toBe(10);
    });

    it('应该清洗和标准化餐食数据', () => {
      const dirtyData: IHealthData = {
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: 170,
          weight: 65,
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
          },
          heartRate: 75,
          bodyTemperature: 36.5,
          bloodOxygen: 98,
        },
        mentalData: {
          stressLevel: 3,
          moodScore: 8,
          sleepQuality: 7,
        },
        nutritionData: {
          calorieIntake: 2000,
          waterIntake: 2500,
          meals: [
            {
              type: '早餐', // 中文类型
              time: new Date(),
              items: [
                {
                  name: '牛奶',
                  amount: -250, // 无效值
                  unit: 'ml',
                  calories: -150, // 无效值
                },
                {
                  name: '', // 无效项目
                  amount: 0,
                  unit: '',
                  calories: 0,
                },
              ],
            },
            {
              type: 'invalid-type', // 无效类型
              time: new Date(),
              items: [],
            },
          ],
        },
        lifestyleData: {
          sleepHours: 8,
          activityLevel: 7,
          activities: [],
        },
      };

      const cleanedData = cleaner.cleanHealthData(dirtyData);

      expect(cleanedData.nutritionData.meals).toHaveLength(1); // 移除无效餐食
      expect(cleanedData.nutritionData.meals[0].type).toBe('breakfast');
      expect(cleanedData.nutritionData.meals[0].items).toHaveLength(1); // 移除无效项目
      expect(cleanedData.nutritionData.meals[0].items[0].amount).toBe(0);
      expect(cleanedData.nutritionData.meals[0].items[0].calories).toBe(0);
    });

    it('应该清洗和标准化活动数据', () => {
      const dirtyData: IHealthData = {
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: 170,
          weight: 65,
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
          },
          heartRate: 75,
          bodyTemperature: 36.5,
          bloodOxygen: 98,
        },
        mentalData: {
          stressLevel: 3,
          moodScore: 8,
          sleepQuality: 7,
        },
        nutritionData: {
          calorieIntake: 2000,
          waterIntake: 2500,
          meals: [],
        },
        lifestyleData: {
          sleepHours: 8,
          activityLevel: 7,
          activities: [
            {
              type: '跑步', // 中文类型
              duration: 1500, // 超出范围
              intensity: 15, // 超出范围
              caloriesBurned: -100, // 无效值
            },
            {
              type: 'invalid-type', // 无效类型
              duration: -30, // 无效值
              intensity: -5, // 无效值
              caloriesBurned: 150,
            },
          ],
        },
      };

      const cleanedData = cleaner.cleanHealthData(dirtyData);

      expect(cleanedData.lifestyleData.activities).toHaveLength(2);

      const runningActivity = cleanedData.lifestyleData.activities[0];
      expect(runningActivity.type).toBe('running');
      expect(runningActivity.duration).toBe(1440); // 最大值
      expect(runningActivity.intensity).toBe(10); // 最大值
      expect(runningActivity.caloriesBurned).toBe(0);

      const otherActivity = cleanedData.lifestyleData.activities[1];
      expect(otherActivity.type).toBe('other');
      expect(otherActivity.duration).toBe(0);
      expect(otherActivity.intensity).toBe(0);
      expect(otherActivity.caloriesBurned).toBe(150);
    });
  });
});
