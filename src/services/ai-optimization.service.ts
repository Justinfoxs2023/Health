import { Injectable } from '@nestjs/common';
import { aiOptimizationConfig } from '../config/performance.config';
import * as tf from '@tensorflow/tfjs';
import { ModelService } from './model.service';
import { CacheService } from './cache.service';

@Injectable()
export class AIOptimizationService {
  private modelCache: Map<string, any> = new Map();
  private batchQueue: Map<string, any[]> = new Map();
  private processingBatch: boolean = false;

  constructor(
    private readonly modelService: ModelService,
    private readonly cacheService: CacheService,
  ) {
    this.initializeOptimization();
  }

  private async initializeOptimization() {
    // 启用TensorFlow内存管理
    tf.enableProdMode();
    tf.engine().startScope();

    // 初始化批处理队列
    this.startBatchProcessor();
  }

  // 模型优化
  async optimizeModel(modelId: string) {
    try {
      const model = await this.modelService.getModel(modelId);
      
      if (aiOptimizationConfig.modelCompression.enabled) {
        // 模型量化
        const quantizedModel = await this.quantizeModel(model);
        
        // 模型剪枝
        const prunedModel = await this.pruneModel(quantizedModel);
        
        // 更新缓存
        await this.updateModelCache(modelId, prunedModel);
        
        return prunedModel;
      }
      
      return model;
    } catch (error) {
      console.error('Model optimization failed:', error);
      throw error;
    }
  }

  // 批量处理预测请求
  async batchPredict(modelId: string, input: any) {
    if (!aiOptimizationConfig.batchProcessing.enabled) {
      return this.predict(modelId, input);
    }

    return new Promise((resolve, reject) => {
      // 添加到批处理队列
      if (!this.batchQueue.has(modelId)) {
        this.batchQueue.set(modelId, []);
      }
      
      this.batchQueue.get(modelId).push({
        input,
        resolve,
        reject,
        timestamp: Date.now()
      });

      // 检查是否需要立即处理
      this.checkBatchProcess(modelId);
    });
  }

  // 模型预测
  private async predict(modelId: string, input: any) {
    try {
      const model = await this.getOptimizedModel(modelId);
      const prediction = await model.predict(input);
      return prediction;
    } catch (error) {
      console.error('Prediction failed:', error);
      throw error;
    }
  }

  // 获取优化后的模型
  private async getOptimizedModel(modelId: string) {
    // 检查缓存
    if (this.modelCache.has(modelId)) {
      return this.modelCache.get(modelId);
    }

    // 优化模型
    const optimizedModel = await this.optimizeModel(modelId);
    this.modelCache.set(modelId, optimizedModel);

    return optimizedModel;
  }

  // 模型量化
  private async quantizeModel(model: tf.LayersModel) {
    if (aiOptimizationConfig.modelCompression.method === 'quantization') {
      // 实现模型量化逻辑
      const quantizedModel = await tf.quantization.quantizeModel(model, {
        quantizeWeights: true,
        quantizationBytes: 1  // int8量化
      });
      return quantizedModel;
    }
    return model;
  }

  // 模型剪枝
  private async pruneModel(model: tf.LayersModel) {
    // 实现模型剪枝逻辑
    return model;
  }

  // 更新模型缓存
  private async updateModelCache(modelId: string, model: any) {
    if (aiOptimizationConfig.modelCaching.enabled) {
      // 检查缓存大小
      if (this.modelCache.size >= aiOptimizationConfig.modelCaching.maxSize) {
        // 使用LRU策略清理缓存
        this.cleanModelCache();
      }
      
      this.modelCache.set(modelId, model);
    }
  }

  // 清理模型缓存
  private cleanModelCache() {
    // 实现LRU缓存清理逻辑
    const cacheEntries = Array.from(this.modelCache.entries());
    cacheEntries.sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    
    // 删除最早使用的模型直到缓存大小合适
    while (this.modelCache.size > aiOptimizationConfig.modelCaching.maxSize / 2) {
      const [modelId] = cacheEntries.shift();
      this.modelCache.delete(modelId);
    }
  }

  // 启动批处理器
  private startBatchProcessor() {
    setInterval(() => {
      if (!this.processingBatch) {
        this.processBatches();
      }
    }, aiOptimizationConfig.batchProcessing.timeout);
  }

  // 处理批量请求
  private async processBatches() {
    this.processingBatch = true;

    try {
      for (const [modelId, queue] of this.batchQueue.entries()) {
        if (queue.length === 0) continue;

        // 获取批量数据
        const batch = queue.splice(0, aiOptimizationConfig.batchProcessing.maxBatchSize);
        const inputs = batch.map(item => item.input);

        // 批量预测
        const predictions = await this.predict(modelId, inputs);

        // 分发结果
        batch.forEach((item, index) => {
          item.resolve(predictions[index]);
        });
      }
    } catch (error) {
      console.error('Batch processing failed:', error);
    } finally {
      this.processingBatch = false;
    }
  }

  // 检查是否需要立即处理批量请求
  private checkBatchProcess(modelId: string) {
    const queue = this.batchQueue.get(modelId);
    if (queue.length >= aiOptimizationConfig.batchProcessing.maxBatchSize) {
      this.processBatches();
    }
  }

  // 资源清理
  async cleanup() {
    tf.engine().endScope();
    this.modelCache.clear();
    this.batchQueue.clear();
  }
} 