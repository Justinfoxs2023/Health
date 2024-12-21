import * as tf from '@tensorflow/tfjs-node';
import { IHealthData } from '../../../shared/types/health.types';
import { LifestyleModelTrainer } from '../train-lifestyle';
import { Test, TestingModule } from '@nestjs/testing';

describe('LifestyleModelTrainer', () => {
  let trainer: LifestyleModelTrainer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifestyleModelTrainer],
    }).compile();

    trainer = module.get<LifestyleModelTrainer>(LifestyleModelTrainer);
  });

  describe('train', () => {
    it('应该成功训练模型', async () => {
      // 准备训练数据
      const trainingData: IHealthData[] = Array(100)
        .fill(null)
        .map(() => ({
          userId: 'test-user',
          timestamp: new Date(),
          physicalData: {
            height: Math.random() * 50 + 150,
            weight: Math.random() * 40 + 50,
            bloodPressure: {
              systolic: Math.random() * 40 + 100,
              diastolic: Math.random() * 30 + 60,
            },
            heartRate: Math.random() * 40 + 60,
            bodyTemperature: Math.random() * 1.5 + 36,
            bloodOxygen: Math.random() * 5 + 95,
          },
          mentalData: {
            stressLevel: Math.floor(Math.random() * 11),
            moodScore: Math.floor(Math.random() * 11),
            sleepQuality: Math.floor(Math.random() * 11),
          },
          nutritionData: {
            calorieIntake: Math.random() * 1000 + 1500,
            waterIntake: Math.random() * 1000 + 1500,
            meals: [
              {
                type: 'breakfast',
                time: new Date(),
                items: [
                  {
                    name: '牛奶',
                    amount: 250,
                    unit: 'ml',
                    calories: 150,
                  },
                  {
                    name: '面包',
                    amount: 100,
                    unit: 'g',
                    calories: 250,
                  },
                ],
              },
              {
                type: 'lunch',
                time: new Date(),
                items: [
                  {
                    name: '米饭',
                    amount: 200,
                    unit: 'g',
                    calories: 260,
                  },
                  {
                    name: '鸡肉',
                    amount: 150,
                    unit: 'g',
                    calories: 250,
                  },
                ],
              },
            ],
          },
          lifestyleData: {
            sleepHours: Math.random() * 4 + 6,
            activityLevel: Math.floor(Math.random() * 11),
            activities: [
              {
                type: 'walking',
                duration: Math.random() * 60 + 30,
                intensity: Math.floor(Math.random() * 6 + 3),
                caloriesBurned: Math.random() * 200 + 100,
              },
              {
                type: 'running',
                duration: Math.random() * 30 + 15,
                intensity: Math.floor(Math.random() * 4 + 6),
                caloriesBurned: Math.random() * 300 + 200,
              },
            ],
          },
        }));

      // 训练模型
      const history = await trainer.train(trainingData);

      // 验证训练结果
      expect(history).toBeDefined();
      expect(history.history.loss).toBeDefined();
      expect(history.history.acc).toBeDefined();
      expect(history.history.loss.length).toBeGreaterThan(0);
      expect(history.history.acc.length).toBeGreaterThan(0);

      // 验证最终损失和准确率
      const finalLoss = history.history.loss[history.history.loss.length - 1];
      const finalAccuracy = history.history.acc[history.history.acc.length - 1];
      expect(finalLoss).toBeLessThan(0.5);
      expect(finalAccuracy).toBeGreaterThan(0.7);
    });

    it('应该能够评估模型性能', async () => {
      // 准备测试数据
      const testData: IHealthData[] = Array(20)
        .fill(null)
        .map(() => ({
          userId: 'test-user',
          timestamp: new Date(),
          physicalData: {
            height: Math.random() * 50 + 150,
            weight: Math.random() * 40 + 50,
            bloodPressure: {
              systolic: Math.random() * 40 + 100,
              diastolic: Math.random() * 30 + 60,
            },
            heartRate: Math.random() * 40 + 60,
            bodyTemperature: Math.random() * 1.5 + 36,
            bloodOxygen: Math.random() * 5 + 95,
          },
          mentalData: {
            stressLevel: Math.floor(Math.random() * 11),
            moodScore: Math.floor(Math.random() * 11),
            sleepQuality: Math.floor(Math.random() * 11),
          },
          nutritionData: {
            calorieIntake: Math.random() * 1000 + 1500,
            waterIntake: Math.random() * 1000 + 1500,
            meals: [
              {
                type: 'breakfast',
                time: new Date(),
                items: [
                  {
                    name: '牛奶',
                    amount: 250,
                    unit: 'ml',
                    calories: 150,
                  },
                ],
              },
            ],
          },
          lifestyleData: {
            sleepHours: Math.random() * 4 + 6,
            activityLevel: Math.floor(Math.random() * 11),
            activities: [
              {
                type: 'walking',
                duration: Math.random() * 60 + 30,
                intensity: Math.floor(Math.random() * 6 + 3),
                caloriesBurned: Math.random() * 200 + 100,
              },
            ],
          },
        }));

      // 先训练模型
      await trainer.train(testData);

      // 评估模型
      const evaluation = await trainer.evaluate(testData);

      // 验证评估结果
      expect(evaluation).toBeDefined();
      expect(evaluation.loss).toBeDefined();
      expect(evaluation.accuracy).toBeDefined();
      expect(evaluation.loss).toBeLessThan(1);
      expect(evaluation.accuracy).toBeGreaterThan(0.5);
    });

    it('应该能够处理不同类型的活动数据', async () => {
      // 准备包含各种活动类型的数据
      const diverseData: IHealthData[] = Array(50)
        .fill(null)
        .map(() => ({
          userId: 'test-user',
          timestamp: new Date(),
          physicalData: {
            height: Math.random() * 50 + 150,
            weight: Math.random() * 40 + 50,
            bloodPressure: {
              systolic: Math.random() * 40 + 100,
              diastolic: Math.random() * 30 + 60,
            },
            heartRate: Math.random() * 40 + 60,
            bodyTemperature: Math.random() * 1.5 + 36,
            bloodOxygen: Math.random() * 5 + 95,
          },
          mentalData: {
            stressLevel: Math.floor(Math.random() * 11),
            moodScore: Math.floor(Math.random() * 11),
            sleepQuality: Math.floor(Math.random() * 11),
          },
          nutritionData: {
            calorieIntake: Math.random() * 1000 + 1500,
            waterIntake: Math.random() * 1000 + 1500,
            meals: [],
          },
          lifestyleData: {
            sleepHours: Math.random() * 4 + 6,
            activityLevel: Math.floor(Math.random() * 11),
            activities: [
              {
                type: ['walking', 'running', 'cycling', 'swimming', 'yoga', 'gym'][
                  Math.floor(Math.random() * 6)
                ],
                duration: Math.random() * 120 + 30,
                intensity: Math.floor(Math.random() * 11),
                caloriesBurned: Math.random() * 500 + 100,
              },
            ],
          },
        }));

      // 训练模型
      const history = await trainer.train(diverseData);

      // 验证训练结果
      expect(history).toBeDefined();
      expect(history.history.loss).toBeDefined();
      expect(history.history.acc).toBeDefined();
    });

    it('应该能够处理不规律的生活方式数据', async () => {
      // 准备包含不规律生活方式的数据
      const irregularData: IHealthData[] = Array(50)
        .fill(null)
        .map(() => ({
          userId: 'test-user',
          timestamp: new Date(),
          physicalData: {
            height: Math.random() * 50 + 150,
            weight: Math.random() * 40 + 50,
            bloodPressure: {
              systolic: Math.random() * 40 + 100,
              diastolic: Math.random() * 30 + 60,
            },
            heartRate: Math.random() * 40 + 60,
            bodyTemperature: Math.random() * 1.5 + 36,
            bloodOxygen: Math.random() * 5 + 95,
          },
          mentalData: {
            stressLevel: Math.floor(Math.random() * 11),
            moodScore: Math.floor(Math.random() * 11),
            sleepQuality: Math.floor(Math.random() * 11),
          },
          nutritionData: {
            calorieIntake: Math.random() * 2000 + 500, // 不规律的卡路里摄入
            waterIntake: Math.random() * 2000 + 500, // 不规律的水分摄入
            meals: [
              {
                type: ['breakfast', 'lunch', 'dinner', 'snack'][Math.floor(Math.random() * 4)],
                time: new Date(),
                items: [
                  {
                    name: '随机食物',
                    amount: Math.random() * 500,
                    unit: 'g',
                    calories: Math.random() * 1000,
                  },
                ],
              },
            ],
          },
          lifestyleData: {
            sleepHours: Math.random() * 12 + 4, // 不规律的睡眠时间
            activityLevel: Math.floor(Math.random() * 11),
            activities: Array(Math.floor(Math.random() * 5))
              .fill(null)
              .map(() => ({
                type: ['walking', 'running', 'cycling', 'swimming', 'yoga', 'gym'][
                  Math.floor(Math.random() * 6)
                ],
                duration: Math.random() * 180 + 10, // 不规律的运动时长
                intensity: Math.floor(Math.random() * 11),
                caloriesBurned: Math.random() * 1000,
              })),
          },
        }));

      // 训练模型
      const history = await trainer.train(irregularData);

      // 验证训练结果
      expect(history).toBeDefined();
      expect(history.history.loss).toBeDefined();
      expect(history.history.acc).toBeDefined();
    });

    it('应该能够保存和加载模型', async () => {
      // 准备训练数据
      const trainingData: IHealthData[] = Array(50)
        .fill(null)
        .map(() => ({
          userId: 'test-user',
          timestamp: new Date(),
          physicalData: {
            height: Math.random() * 50 + 150,
            weight: Math.random() * 40 + 50,
            bloodPressure: {
              systolic: Math.random() * 40 + 100,
              diastolic: Math.random() * 30 + 60,
            },
            heartRate: Math.random() * 40 + 60,
            bodyTemperature: Math.random() * 1.5 + 36,
            bloodOxygen: Math.random() * 5 + 95,
          },
          mentalData: {
            stressLevel: Math.floor(Math.random() * 11),
            moodScore: Math.floor(Math.random() * 11),
            sleepQuality: Math.floor(Math.random() * 11),
          },
          nutritionData: {
            calorieIntake: Math.random() * 1000 + 1500,
            waterIntake: Math.random() * 1000 + 1500,
            meals: [],
          },
          lifestyleData: {
            sleepHours: Math.random() * 4 + 6,
            activityLevel: Math.floor(Math.random() * 11),
            activities: [],
          },
        }));

      // 训练并保存模型
      await trainer.train(trainingData);

      // 验证模型文件是否存在
      const fs = require('fs');
      expect(fs.existsSync('./models/lifestyle/model.json')).toBe(true);

      // 加载模型
      const loadedModel = await tf.loadLayersModel('file://./models/lifestyle/model.json');
      expect(loadedModel).toBeDefined();
      expect(loadedModel.layers.length).toBeGreaterThan(0);
    });
  });
});
