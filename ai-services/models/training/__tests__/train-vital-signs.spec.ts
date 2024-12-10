import { Test, TestingModule } from '@nestjs/testing';
import { VitalSignsModelTrainer } from '../train-vital-signs';
import { HealthData } from '../../../shared/types/health.types';
import * as tf from '@tensorflow/tfjs-node';

describe('VitalSignsModelTrainer', () => {
  let trainer: VitalSignsModelTrainer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VitalSignsModelTrainer],
    }).compile();

    trainer = module.get<VitalSignsModelTrainer>(VitalSignsModelTrainer);
  });

  describe('train', () => {
    it('应该成功训练模型', async () => {
      // 准备训练数据
      const trainingData: HealthData[] = Array(100).fill(null).map(() => ({
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: Math.random() * 50 + 150, // 150-200cm
          weight: Math.random() * 40 + 50, // 50-90kg
          bloodPressure: {
            systolic: Math.random() * 40 + 100, // 100-140mmHg
            diastolic: Math.random() * 30 + 60 // 60-90mmHg
          },
          heartRate: Math.random() * 40 + 60, // 60-100bpm
          bodyTemperature: Math.random() * 1.5 + 36, // 36-37.5°C
          bloodOxygen: Math.random() * 5 + 95 // 95-100%
        },
        mentalData: {
          stressLevel: Math.floor(Math.random() * 11),
          moodScore: Math.floor(Math.random() * 11),
          sleepQuality: Math.floor(Math.random() * 11)
        },
        nutritionData: {
          calorieIntake: Math.random() * 1000 + 1500,
          waterIntake: Math.random() * 1000 + 1500,
          meals: []
        },
        lifestyleData: {
          sleepHours: Math.random() * 4 + 6,
          activityLevel: Math.floor(Math.random() * 11),
          activities: []
        }
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
      const testData: HealthData[] = Array(20).fill(null).map(() => ({
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: Math.random() * 50 + 150,
          weight: Math.random() * 40 + 50,
          bloodPressure: {
            systolic: Math.random() * 40 + 100,
            diastolic: Math.random() * 30 + 60
          },
          heartRate: Math.random() * 40 + 60,
          bodyTemperature: Math.random() * 1.5 + 36,
          bloodOxygen: Math.random() * 5 + 95
        },
        mentalData: {
          stressLevel: Math.floor(Math.random() * 11),
          moodScore: Math.floor(Math.random() * 11),
          sleepQuality: Math.floor(Math.random() * 11)
        },
        nutritionData: {
          calorieIntake: Math.random() * 1000 + 1500,
          waterIntake: Math.random() * 1000 + 1500,
          meals: []
        },
        lifestyleData: {
          sleepHours: Math.random() * 4 + 6,
          activityLevel: Math.floor(Math.random() * 11),
          activities: []
        }
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

    it('应该能够处理异常数据', async () => {
      // 准备包含异常值的数据
      const abnormalData: HealthData[] = Array(20).fill(null).map(() => ({
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: Math.random() * 1000, // 异常身高
          weight: Math.random() * 1000, // 异常体重
          bloodPressure: {
            systolic: Math.random() * 300, // 异常血压
            diastolic: Math.random() * 200
          },
          heartRate: Math.random() * 300, // 异常心率
          bodyTemperature: Math.random() * 10 + 35, // 异常体温
          bloodOxygen: Math.random() * 100 // 异常血氧
        },
        mentalData: {
          stressLevel: Math.floor(Math.random() * 20), // 异常压力水平
          moodScore: Math.floor(Math.random() * 20), // 异常情绪评分
          sleepQuality: Math.floor(Math.random() * 20) // 异常睡眠质量
        },
        nutritionData: {
          calorieIntake: Math.random() * 10000,
          waterIntake: Math.random() * 10000,
          meals: []
        },
        lifestyleData: {
          sleepHours: Math.random() * 24,
          activityLevel: Math.floor(Math.random() * 20),
          activities: []
        }
      }));

      // 训练模型
      const history = await trainer.train(abnormalData);

      // 验证模型仍能完成训练
      expect(history).toBeDefined();
      expect(history.history.loss).toBeDefined();
      expect(history.history.acc).toBeDefined();
    });

    it('应该能够保存和加载模型', async () => {
      // 准备训练数据
      const trainingData: HealthData[] = Array(50).fill(null).map(() => ({
        userId: 'test-user',
        timestamp: new Date(),
        physicalData: {
          height: Math.random() * 50 + 150,
          weight: Math.random() * 40 + 50,
          bloodPressure: {
            systolic: Math.random() * 40 + 100,
            diastolic: Math.random() * 30 + 60
          },
          heartRate: Math.random() * 40 + 60,
          bodyTemperature: Math.random() * 1.5 + 36,
          bloodOxygen: Math.random() * 5 + 95
        },
        mentalData: {
          stressLevel: Math.floor(Math.random() * 11),
          moodScore: Math.floor(Math.random() * 11),
          sleepQuality: Math.floor(Math.random() * 11)
        },
        nutritionData: {
          calorieIntake: Math.random() * 1000 + 1500,
          waterIntake: Math.random() * 1000 + 1500,
          meals: []
        },
        lifestyleData: {
          sleepHours: Math.random() * 4 + 6,
          activityLevel: Math.floor(Math.random() * 11),
          activities: []
        }
      }));

      // 训练并保存模型
      await trainer.train(trainingData);

      // 验证模型文件是否存在
      // 注意：这里需要根据实际的文件系统路径进行调整
      const fs = require('fs');
      expect(fs.existsSync('./models/vital-signs/model.json')).toBe(true);

      // 加载模型
      const loadedModel = await tf.loadLayersModel('file://./models/vital-signs/model.json');
      expect(loadedModel).toBeDefined();
      expect(loadedModel.layers.length).toBeGreaterThan(0);
    });
  });
}); 