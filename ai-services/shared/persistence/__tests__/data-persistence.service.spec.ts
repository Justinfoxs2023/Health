import { Test, TestingModule } from '@nestjs/testing';
import { DataPersistenceService } from '../data-persistence.service';
import { HealthData } from '../../types/health.types';
import * as mongoose from 'mongoose';

describe('DataPersistenceService', () => {
  let service: DataPersistenceService;

  beforeAll(async () => {
    // 连接测试数据库
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/health-test');
  });

  afterAll(async () => {
    // 清理数据库并断开连接
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataPersistenceService],
    }).compile();

    service = module.get<DataPersistenceService>(DataPersistenceService);

    // 清理集合
    await Promise.all([
      mongoose.connection.collection('healthdata').deleteMany({}),
      mongoose.connection.collection('modeldata').deleteMany({})
    ]);
  });

  describe('健康数据持久化', () => {
    it('应该能够保存单条健康数据', async () => {
      const testData: HealthData = {
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

      const id = await service.saveHealthData(testData);
      expect(id).toBeDefined();

      const savedData = await service.queryHealthData(testData.userId);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].userId).toBe(testData.userId);
    });

    it('应该能够批量保存健康数据', async () => {
      const testDataList: HealthData[] = Array(5).fill(null).map((_, index) => ({
        userId: `test-user-${index}`,
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
          activities: []
        }
      }));

      const ids = await service.bulkSaveHealthData(testDataList);
      expect(ids).toHaveLength(5);

      const savedData = await service.queryHealthData(testDataList[0].userId);
      expect(savedData).toHaveLength(1);
    });

    it('应该能够按时间范围查询健康数据', async () => {
      const userId = 'test-user';
      const testDataList: HealthData[] = Array(10).fill(null).map((_, index) => ({
        userId,
        timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000), // 每天一条数据
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
          activities: []
        }
      }));

      await service.bulkSaveHealthData(testDataList);

      const startTime = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      const endTime = new Date();

      const queryResult = await service.queryHealthData(userId, startTime, endTime);
      expect(queryResult.length).toBe(6); // 包括今天在内的6天数据
    });
  });

  describe('模型数据持久化', () => {
    it('应该能够保存模型数据', async () => {
      const modelData = {
        modelType: 'vital-signs',
        version: '1.0.0',
        modelPath: '/models/vital-signs/1.0.0',
        metrics: {
          loss: 0.2,
          accuracy: 0.85,
          precision: 0.83,
          recall: 0.87,
          f1Score: 0.85
        },
        hyperparameters: {
          learningRate: 0.001,
          batchSize: 32,
          epochs: 100
        },
        trainingDuration: 3600,
        datasetSize: 1000
      };

      const id = await service.saveModelData(modelData);
      expect(id).toBeDefined();

      const savedData = await service.getLatestModelData(modelData.modelType);
      expect(savedData).toBeDefined();
      expect(savedData.version).toBe(modelData.version);
    });

    it('应该返回最新版本的模型数据', async () => {
      const modelType = 'vital-signs';
      const modelDataList = Array(3).fill(null).map((_, index) => ({
        modelType,
        version: `1.0.${index}`,
        modelPath: `/models/vital-signs/1.0.${index}`,
        metrics: {
          loss: 0.2 - index * 0.05,
          accuracy: 0.85 + index * 0.02
        },
        hyperparameters: {
          learningRate: 0.001,
          batchSize: 32,
          epochs: 100
        },
        trainingDuration: 3600,
        datasetSize: 1000
      }));

      for (const data of modelDataList) {
        await service.saveModelData(data);
        // 等待1ms确保时间戳不同
        await new Promise(resolve => setTimeout(resolve, 1));
      }

      const latestModel = await service.getLatestModelData(modelType);
      expect(latestModel).toBeDefined();
      expect(latestModel.version).toBe('1.0.2');
    });
  });

  describe('数据清理', () => {
    it('应该能够清理过期数据', async () => {
      // 准备测试数据
      const userId = 'test-user';
      const oldData: HealthData[] = Array(5).fill(null).map((_, index) => ({
        userId,
        timestamp: new Date(Date.now() - (30 + index) * 24 * 60 * 60 * 1000), // 30天前的数据
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
          activities: []
        }
      }));

      const newData: HealthData[] = Array(5).fill(null).map((_, index) => ({
        userId,
        timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000), // 最近的数据
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
          activities: []
        }
      }));

      await service.bulkSaveHealthData([...oldData, ...newData]);

      // 清理30天前的数据
      await service.cleanupOldData(30);

      // 验证结果
      const remainingData = await service.queryHealthData(userId);
      expect(remainingData.length).toBe(5); // 只剩下最近的5条数据
    });
  });

  describe('数据统计', () => {
    it('应该能够获取数据统计信息', async () => {
      // 准备测试数据
      const healthData: HealthData[] = Array(10).fill(null).map((_, index) => ({
        userId: `test-user-${index % 3}`, // 3个用户
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
          activities: []
        }
      }));

      const modelData = {
        modelType: 'vital-signs',
        version: '1.0.0',
        modelPath: '/models/vital-signs/1.0.0',
        metrics: {
          loss: 0.2,
          accuracy: 0.85
        },
        hyperparameters: {},
        trainingDuration: 3600,
        datasetSize: 1000
      };

      await service.bulkSaveHealthData(healthData);
      await service.saveModelData(modelData);

      const stats = await service.getDataStats();
      expect(stats.totalHealthRecords).toBe(10);
      expect(stats.totalUsers).toBe(3);
      expect(stats.totalModels).toBe(1);
      expect(stats.latestUpdate).toBeDefined();
      expect(stats.storageSize).toBeGreaterThan(0);
    });
  });
}); 