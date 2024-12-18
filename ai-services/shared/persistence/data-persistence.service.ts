import * as mongoose from 'mongoose';
import { IHealthData } from '../types/health.types';
import { Injectable } from '@nestjs/common';
import { Logger } from '../utils/logger';
import { PerformanceMonitor } from '../monitoring/performance-monitor';

@Injectable()
export class DataPersistenceService {
  private readonly logger = new Logger(DataPersistenceService.name);
  private readonly monitor = new PerformanceMonitor();

  // 健康数据模型
  private readonly HealthDataModel = mongoose.model(
    'HealthData',
    new mongoose.Schema(
      {
        userId: { type: String, required: true, index: true },
        timestamp: { type: Date, required: true, index: true },
        physicalData: {
          height: Number,
          weight: Number,
          bloodPressure: {
            systolic: Number,
            diastolic: Number,
          },
          heartRate: Number,
          bodyTemperature: Number,
          bloodOxygen: Number,
        },
        mentalData: {
          stressLevel: Number,
          moodScore: Number,
          sleepQuality: Number,
        },
        nutritionData: {
          calorieIntake: Number,
          waterIntake: Number,
          meals: [
            {
              type: String,
              time: Date,
              items: [
                {
                  name: String,
                  amount: Number,
                  unit: String,
                  calories: Number,
                },
              ],
            },
          ],
        },
        lifestyleData: {
          sleepHours: Number,
          activityLevel: Number,
          activities: [
            {
              type: String,
              duration: Number,
              intensity: Number,
              caloriesBurned: Number,
            },
          ],
        },
      },
      {
        timestamps: true,
        versionKey: false,
      },
    ),
  );

  // 模型数据模型
  private readonly ModelDataModel = mongoose.model(
    'ModelData',
    new mongoose.Schema(
      {
        modelType: { type: String, required: true, index: true },
        version: { type: String, required: true },
        timestamp: { type: Date, required: true },
        modelPath: { type: String, required: true },
        metrics: {
          loss: Number,
          accuracy: Number,
          precision: Number,
          recall: Number,
          f1Score: Number,
        },
        hyperparameters: mongoose.Schema.Types.Mixed,
        trainingDuration: Number,
        datasetSize: Number,
      },
      {
        timestamps: true,
        versionKey: false,
      },
    ),
  );

  /**
   * 保存健康数据
   */
  @PerformanceMonitor.Monitor({
    type: 'data_processing',
    operationType: 'save_health_data',
  })
  async saveHealthData(data: IHealthData): Promise<string> {
    try {
      const healthData = new this.HealthDataModel(data);
      const result = await healthData.save();

      this.logger.info('保存健康数据成功', { userId: data.userId });
      return result._id.toString();
    } catch (error) {
      this.logger.error('保存健康数据失败', error);
      throw error;
    }
  }

  /**
   * 批量保存健康数据
   */
  @PerformanceMonitor.Monitor({
    type: 'data_processing',
    operationType: 'bulk_save_health_data',
  })
  async bulkSaveHealthData(dataList: IHealthData[]): Promise<string[]> {
    try {
      const operations = dataList.map(data => ({
        insertOne: { document: data },
      }));

      const result = await this.HealthDataModel.bulkWrite(operations);

      this.logger.info('批量保存健康数据成功', {
        count: result.insertedCount,
      });

      return Object.values(result.insertedIds).map(id => id.toString());
    } catch (error) {
      this.logger.error('批量保存健康数据失败', error);
      throw error;
    }
  }

  /**
   * 查询用户健康数据
   */
  @PerformanceMonitor.Monitor({
    type: 'data_processing',
    operationType: 'query_health_data',
  })
  async queryHealthData(
    userId: string,
    startTime?: Date,
    endTime?: Date,
    limit?: number,
  ): Promise<IHealthData[]> {
    try {
      const query: any = { userId };

      if (startTime || endTime) {
        query.timestamp = {};
        if (startTime) query.timestamp.$gte = startTime;
        if (endTime) query.timestamp.$lte = endTime;
      }

      const result = await this.HealthDataModel.find(query)
        .sort({ timestamp: -1 })
        .limit(limit || 100)
        .lean();

      this.logger.info('查询健康数据成功', {
        userId,
        count: result.length,
      });

      return result;
    } catch (error) {
      this.logger.error('查询健康数据失败', error);
      throw error;
    }
  }

  /**
   * 保存模型数据
   */
  @PerformanceMonitor.Monitor({
    type: 'data_processing',
    operationType: 'save_model_data',
  })
  async saveModelData(data: {
    modelType: string;
    version: string;
    modelPath: string;
    metrics: {
      loss: number;
      accuracy: number;
      precision?: number;
      recall?: number;
      f1Score?: number;
    };
    hyperparameters: any;
    trainingDuration: number;
    datasetSize: number;
  }): Promise<string> {
    try {
      const modelData = new this.ModelDataModel({
        ...data,
        timestamp: new Date(),
      });
      const result = await modelData.save();

      this.logger.info('保存模型数据成功', {
        modelType: data.modelType,
        version: data.version,
      });

      return result._id.toString();
    } catch (error) {
      this.logger.error('保存模型数据失败', error);
      throw error;
    }
  }

  /**
   * 查询最新模型数据
   */
  @PerformanceMonitor.Monitor({
    type: 'data_processing',
    operationType: 'query_model_data',
  })
  async getLatestModelData(modelType: string): Promise<{
    version: string;
    modelPath: string;
    metrics: {
      loss: number;
      accuracy: number;
      precision?: number;
      recall?: number;
      f1Score?: number;
    };
    hyperparameters: any;
    timestamp: Date;
  } | null> {
    try {
      const result = await this.ModelDataModel.findOne({ modelType })
        .sort({ timestamp: -1 })
        .lean();

      if (!result) {
        this.logger.warn('未找到模型数据', { modelType });
        return null;
      }

      this.logger.info('查询模型数据成功', {
        modelType,
        version: result.version,
      });

      return {
        version: result.version,
        modelPath: result.modelPath,
        metrics: result.metrics,
        hyperparameters: result.hyperparameters,
        timestamp: result.timestamp,
      };
    } catch (error) {
      this.logger.error('查询模型数据失败', error);
      throw error;
    }
  }

  /**
   * 删除过期数据
   */
  @PerformanceMonitor.Monitor({
    type: 'data_processing',
    operationType: 'cleanup_data',
  })
  async cleanupOldData(retentionDays: number): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      // 删除旧的健康数据
      const healthResult = await this.HealthDataModel.deleteMany({
        timestamp: { $lt: cutoffDate },
      });

      // 保留每个模型类型的最新N个版本
      const modelTypes = await this.ModelDataModel.distinct('modelType');
      let totalModelsDeleted = 0;

      for (const modelType of modelTypes) {
        const models = await this.ModelDataModel.find({ modelType }).sort({ timestamp: -1 });

        if (models.length > 5) {
          // 保留最新的5个版本
          const modelsToDelete = models.slice(5);
          const deleteResult = await this.ModelDataModel.deleteMany({
            _id: { $in: modelsToDelete.map(m => m._id) },
          });
          totalModelsDeleted += deleteResult.deletedCount;
        }
      }

      this.logger.info('清理过期数据完成', {
        healthDataDeleted: healthResult.deletedCount,
        modelDataDeleted: totalModelsDeleted,
      });
    } catch (error) {
      this.logger.error('清理过期数据失败', error);
      throw error;
    }
  }

  /**
   * 获取数据统计信息
   */
  async getDataStats(): Promise<{
    totalHealthRecords: number;
    totalUsers: number;
    totalModels: number;
    latestUpdate: Date;
    storageSize: number;
  }> {
    try {
      const [totalHealthRecords, totalUsers, totalModels, latestHealthRecord, latestModelRecord] =
        await Promise.all([
          this.HealthDataModel.countDocuments(),
          this.HealthDataModel.distinct('userId').then(users => users.length),
          this.ModelDataModel.countDocuments(),
          this.HealthDataModel.findOne().sort({ timestamp: -1 }).select('timestamp'),
          this.ModelDataModel.findOne().sort({ timestamp: -1 }).select('timestamp'),
        ]);

      const latestUpdate = new Date(
        Math.max(
          latestHealthRecord?.timestamp?.getTime() || 0,
          latestModelRecord?.timestamp?.getTime() || 0,
        ),
      );

      // 获取集合大小
      const db = mongoose.connection.db;
      const [healthStats, modelStats] = await Promise.all([
        db.collection('healthdata').stats(),
        db.collection('modeldata').stats(),
      ]);

      const storageSize = healthStats.storageSize + modelStats.storageSize;

      return {
        totalHealthRecords,
        totalUsers,
        totalModels,
        latestUpdate,
        storageSize,
      };
    } catch (error) {
      this.logger.error('获取数据统计信息失败', error);
      throw error;
    }
  }
}
