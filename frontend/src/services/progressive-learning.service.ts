import * as tf from '@tensorflow/tfjs';
import { LocalDatabase, createDatabase } from '../utils/local-database';

interface ProgressiveConfig {
  initialModelSize: number;
  growthRate: number;
  maxModelSize: number;
  learningRate: number;
  evaluationMetric: string;
  growthThreshold: number;
}

interface GrowthResult {
  newSize: number;
  performance: {
    accuracy: number;
    loss: number;
  };
  growthMetrics: {
    complexityIncrease: number;
    performanceGain: number;
  };
}

export class ProgressiveLearningService {
  private db: LocalDatabase;
  private model: tf.LayersModel | null = null;
  private config: ProgressiveConfig;
  private currentSize: number;

  constructor() {
    this.db = createDatabase('progressive-learning');
    this.config = {
      initialModelSize: 64,
      growthRate: 1.5,
      maxModelSize: 1024,
      learningRate: 0.001,
      evaluationMetric: 'accuracy',
      growthThreshold: 0.8
    };
    this.currentSize = this.config.initialModelSize;
    this.initialize();
  }

  private async initialize() {
    await this.loadModel();
  }

  // 渐进式训练
  async train(
    data: tf.Tensor,
    labels: tf.Tensor,
    validationData?: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<GrowthResult> {
    if (!this.model) {
      this.model = await this.buildInitialModel();
    }

    // 训练当前模型
    const history = await this.model.fit(data, labels, {
      epochs: 10,
      validationData: validationData ? [validationData.x, validationData.y] : undefined,
      callbacks: this.createTrainingCallbacks()
    });

    // 评估性能
    const performance = await this.evaluateModel(validationData || { x: data, y: labels });

    // 检查是否需要增长
    if (this.shouldGrow(performance)) {
      return await this.growModel(data, labels);
    }

    return {
      newSize: this.currentSize,
      performance,
      growthMetrics: {
        complexityIncrease: 0,
        performanceGain: 0
      }
    };
  }

  // 构建初始模型
  private async buildInitialModel(): Promise<tf.LayersModel> {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: this.currentSize,
      activation: 'relu',
      inputShape: [this.getInputShape()]
    }));

    model.add(tf.layers.dense({
      units: this.getOutputShape(),
      activation: 'softmax'
    }));

    model.compile({
      optimizer: tf.train.adam(this.config.learningRate),
      loss: 'categoricalCrossentropy',
      metrics: [this.config.evaluationMetric]
    });

    return model;
  }

  // 创建训练回调
  private createTrainingCallbacks(): tf.CustomCallbackArgs[] {
    return [
      {
        onEpochEnd: async (epoch, logs) => {
          console.log(`Epoch ${epoch}: ${this.config.evaluationMetric} = ${logs[this.config.evaluationMetric]}`);
        }
      }
    ];
  }

  // 评估模型
  private async evaluateModel(
    data: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<{
    accuracy: number;
    loss: number;
  }> {
    const evaluation = await this.model!.evaluate(data.x, data.y);
    return {
      accuracy: (evaluation[1] as tf.Scalar).dataSync()[0],
      loss: (evaluation[0] as tf.Scalar).dataSync()[0]
    };
  }

  // 检查是否应该增长
  private shouldGrow(performance: { accuracy: number; loss: number }): boolean {
    return (
      performance.accuracy > this.config.growthThreshold &&
      this.currentSize < this.config.maxModelSize
    );
  }

  // 增长模型
  private async growModel(
    data: tf.Tensor,
    labels: tf.Tensor
  ): Promise<GrowthResult> {
    const oldPerformance = await this.evaluateModel({ x: data, y: labels });
    const oldSize = this.currentSize;

    // 计算新大小
    this.currentSize = Math.min(
      Math.floor(this.currentSize * this.config.growthRate),
      this.config.maxModelSize
    );

    // 保存旧模型的权重
    const oldWeights = this.model!.getWeights();

    // 构建新模型
    this.model = await this.buildGrowingModel(oldWeights);

    // 训练新模型
    await this.model.fit(data, labels, {
      epochs: 5,
      callbacks: this.createTrainingCallbacks()
    });

    // 评估新模型
    const newPerformance = await this.evaluateModel({ x: data, y: labels });

    return {
      newSize: this.currentSize,
      performance: newPerformance,
      growthMetrics: {
        complexityIncrease: (this.currentSize - oldSize) / oldSize,
        performanceGain: newPerformance.accuracy - oldPerformance.accuracy
      }
    };
  }

  // 构建增长的模型
  private async buildGrowingModel(oldWeights: tf.Tensor[]): Promise<tf.LayersModel> {
    const model = await this.buildInitialModel();
    
    // 迁移旧权重
    const newWeights = model.getWeights().map((weight, i) => {
      if (i < oldWeights.length) {
        const oldWeight = oldWeights[i];
        return this.transferWeights(oldWeight, weight.shape);
      }
      return weight;
    });

    model.setWeights(newWeights);
    return model;
  }

  // 迁移权重
  private transferWeights(oldWeight: tf.Tensor, newShape: number[]): tf.Tensor {
    return tf.tidy(() => {
      const oldData = oldWeight.dataSync();
      const newData = new Float32Array(tf.util.sizeFromShape(newShape));
      
      // 复制旧权重
      newData.set(oldData.slice(0, Math.min(oldData.length, newData.length)));
      
      // 随机初始化新权重
      for (let i = oldData.length; i < newData.length; i++) {
        newData[i] = Math.random() * 0.1;
      }

      return tf.tensor(newData, newShape);
    });
  }

  // 获取输入形状
  private getInputShape(): number {
    // 实现获取输入形状的逻辑
    return 784; // 示例：MNIST数据集
  }

  // 获取输出形状
  private getOutputShape(): number {
    // 实现获取输出形状的逻辑
    return 10; // 示例：MNIST类别数
  }

  // 保存模型
  private async saveModel(): Promise<void> {
    if (!this.model) return;
    await this.model.save('indexeddb://progressive-model');
    await this.db.put('model-size', this.currentSize);
  }

  // 加载模型
  private async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel('indexeddb://progressive-model');
      const size = await this.db.get('model-size');
      if (size) this.currentSize = size;
    } catch (error) {
      console.error('加载模型失败:', error);
    }
  }
} 