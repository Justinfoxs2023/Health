import * as tf from '@tensorflow/tfjs-node';
import { RedisService } from './RedisService';

import { CacheError } from '@/utils/errors';
import { Logger } from '@/utils/Logger';

export class AIModelCacheService {
  private logger: Logger;
  private redis: RedisService;
  private memoryCache: Map<
    string,
    {
      model: tf.LayersModel;
      lastUsed: Date;
    }
  >;
  private readonly maxMemoryModels = 5;

  constructor() {
    this.logger = new Logger('AIModelCache');
    this.redis = new RedisService();
    this.memoryCache = new Map();
  }

  /**
   * 获取模型（优先从缓存）
   */
  async getModel(modelPath: string): Promise<tf.LayersModel> {
    try {
      // 1. 检查内存缓存
      const memoryModel = this.memoryCache.get(modelPath);
      if (memoryModel) {
        memoryModel.lastUsed = new Date();
        return memoryModel.model;
      }

      // 2. 检查Redis缓存
      const cachedModel = await this.redis.get(`model:${modelPath}`);
      if (cachedModel) {
        const model = await tf.loadLayersModel(tf.io.fromMemory(JSON.parse(cachedModel)));
        await this.addToMemoryCache(modelPath, model);
        return model;
      }

      // 3. 加载模型并缓存
      const model = await tf.loadLayersModel(`file://${modelPath}`);
      await this.cacheModel(modelPath, model);
      return model;
    } catch (error) {
      this.logger.error('获取模型缓存失败', error);
      throw new CacheError('MODEL_CACHE_FAILED', error.message);
    }
  }

  /**
   * 缓存模型
   */
  private async cacheModel(modelPath: string, model: tf.LayersModel): Promise<void> {
    try {
      // 1. 保存到Redis
      const modelJSON = JSON.stringify(
        await model.save(
          tf.io.withSaveHandler(async artifacts => {
            return artifacts;
          }),
        ),
      );

      await this.redis.set(`model:${modelPath}`, modelJSON, 86400); // 缓存24小时

      // 2. 保存到内存缓存
      await this.addToMemoryCache(modelPath, model);
    } catch (error) {
      this.logger.error('缓存模型失败', error);
      throw new CacheError('MODEL_CACHING_FAILED', error.message);
    }
  }

  /**
   * 添加到内存缓存
   */
  private async addToMemoryCache(modelPath: string, model: tf.LayersModel): Promise<void> {
    // 检查缓存大小
    if (this.memoryCache.size >= this.maxMemoryModels) {
      // 移除最久未使用的模型
      let oldestPath: string | null = null;
      let oldestDate = new Date();

      this.memoryCache.forEach((value, path) => {
        if (value.lastUsed < oldestDate) {
          oldestDate = value.lastUsed;
          oldestPath = path;
        }
      });

      if (oldestPath) {
        this.memoryCache.delete(oldestPath);
      }
    }

    // 添加新模型到缓存
    this.memoryCache.set(modelPath, {
      model,
      lastUsed: new Date(),
    });
  }

  /**
   * 清理过期缓存
   */
  async cleanupCache(): Promise<void> {
    try {
      // 清理内存缓存
      const now = new Date();
      const oneHour = 60 * 60 * 1000;

      for (const [path, data] of this.memoryCache.entries()) {
        if (now.getTime() - data.lastUsed.getTime() > oneHour) {
          this.memoryCache.delete(path);
        }
      }

      // 清理Redis缓存
      // 实现Redis缓存清理逻辑
    } catch (error) {
      this.logger.error('清理缓存失败', error);
      throw new CacheError('CACHE_CLEANUP_FAILED', error.message);
    }
  }
}
