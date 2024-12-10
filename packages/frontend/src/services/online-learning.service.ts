import * as tf from '@tensorflow/tfjs';
import { LocalDatabase, createDatabase } from '../utils/local-database';

interface OnlineConfig {
  learningRate: number;
  batchSize: number;
  bufferSize: number;
  updateFrequency: number;
  regularization: {
    type: 'l1' | 'l2';
    lambda: number;
  };
}

interface OnlineMetrics {
  accuracy: number;
  loss: number;
  updateTime: number;
  driftDetection: {
    detected: boolean;
    severity: number;
  };
}

export class OnlineLearningService {
  private db: LocalDatabase;
  private model: tf.LayersModel | null = null;
  private buffer: Array<{x: tf.Tensor, y: tf.Tensor}> = [];
  private config: OnlineConfig;
  private metrics: OnlineMetrics[] = [];

  constructor() {
    this.db = createDatabase('online-learning');
    this.config = {
      learningRate: 0.001,
      batchSize: 32,
      bufferSize: 1000,
      updateFrequency: 10,
      regularization: {
        type: 'l2',
        lambda: 0.01
      }
    };
    this.initialize();
  }

  private async initialize() {
    await this.loadModel();
  }

  // 在线更新
  async update(x: tf.Tensor, y: tf.Tensor): Promise<OnlineMetrics> {
    if (!this.model) {
      this.model = await this.buildModel();
    }

    // 添加到缓冲区
    this.buffer.push({x: x.clone(), y: y.clone()});
    if (this.buffer.length > this.config.bufferSize) {
      const removed = this.buffer.shift();
      removed?.x.dispose();
      removed?.y.dispose();
    }

    // 检测概念漂移
    const drift = await this.detectConceptDrift(x, y);

    // 如果检测到漂移或缓冲区达到更新频率
    if (drift.detected || this.buffer.length % this.config.updateFrequency === 0) {
      const startTime = Date.now();
      
      // 执行增量更新
      const metrics = await this.incrementalUpdate();
      
      const updateTime = Date.now() - startTime;

      const result = {
        accuracy: metrics.accuracy,
        loss: metrics.loss,
        updateTime,
        driftDetection: drift
      };

      this.metrics.push(result);
      await this.saveMetrics();

      return result;
    }

    return {
      accuracy: 0,
      loss: 0,
      updateTime: 0,
      driftDetection: drift
    };
  }

  // 增量更新
  private async incrementalUpdate(): Promise<{accuracy: number, loss: number}> {
    const batchIndices = tf.util.createShuffledIndices(this.buffer.length);
    const batchSize = Math.min(this.config.batchSize, this.buffer.length);
    
    const batch = {
      x: tf.concat(batchIndices.slice(0, batchSize).map(i => this.buffer[i].x)),
      y: tf.concat(batchIndices.slice(0, batchSize).map(i => this.buffer[i].y))
    };

    const history = await this.model!.fit(batch.x, batch.y, {
      epochs: 1,
      batchSize: this.config.batchSize,
      validationSplit: 0.2
    });

    return {
      accuracy: history.history.accuracy[0],
      loss: history.history.loss[0]
    };
  }

  // 检测概念漂移
  private async detectConceptDrift(
    x: tf.Tensor,
    y: tf.Tensor
  ): Promise<{detected: boolean, severity: number}> {
    if (this.metrics.length < 2) {
      return { detected: false, severity: 0 };
    }

    // 计算性能变化
    const recentMetrics = this.metrics.slice(-10);
    const performanceDrop = this.calculatePerformanceDrop(recentMetrics);

    // 预测分布变化
    const distributionShift = await this.calculateDistributionShift(x);

    const severity = (performanceDrop + distributionShift) / 2;
    const detected = severity > 0.3; // 阈值可配置

    return { detected, severity };
  }

  // 计算性能下降
  private calculatePerformanceDrop(metrics: OnlineMetrics[]): number {
    if (metrics.length < 2) return 0;
    
    const recent = metrics.slice(-5);
    const previous = metrics.slice(-10, -5);

    const recentAvg = recent.reduce((acc, m) => acc + m.accuracy, 0) / recent.length;
    const previousAvg = previous.reduce((acc, m) => acc + m.accuracy, 0) / previous.length;

    return Math.max(0, previousAvg - recentAvg);
  }

  // 计算分布偏移
  private async calculateDistributionShift(x: tf.Tensor): Promise<number> {
    if (this.buffer.length < 2) return 0;

    const recentData = tf.concat(this.buffer.slice(-10).map(b => b.x));
    const previousData = tf.concat(this.buffer.slice(-20, -10).map(b => b.x));

    // 使用KL散度或其他统计方法计算分布差异
    const shift = await this.calculateKLDivergence(previousData, recentData);
    
    return shift;
  }

  // 计算KL散度
  private async calculateKLDivergence(p: tf.Tensor, q: tf.Tensor): Promise<number> {
    return tf.tidy(() => {
      const pDist = tf.softmax(p);
      const qDist = tf.softmax(q);
      const kl = pDist.mul(tf.log(pDist.div(qDist))).sum().dataSync()[0];
      return Math.max(0, kl);
    });
  }

  // 构建模型
  private async buildModel(): Promise<tf.LayersModel> {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [this.getInputShape()]
    }));

    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    model.add(tf.layers.dense({
      units: this.getOutputShape(),
      activation: 'softmax'
    }));

    model.compile({
      optimizer: tf.train.adam(this.config.learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  // 获取输入形状
  private getInputShape(): number {
    return 784; // 示例值
  }

  // 获取输出形状
  private getOutputShape(): number {
    return 10; // 示例值
  }

  // 保存指标
  private async saveMetrics(): Promise<void> {
    await this.db.put('online-metrics', this.metrics);
  }

  // 加载模型和指标
  private async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel('indexeddb://online-model');
      const metrics = await this.db.get('online-metrics');
      if (metrics) {
        this.metrics = metrics;
      }
    } catch (error) {
      console.error('加载在线学习模型失败:', error);
    }
  }

  // 获取性能指标
  async getPerformanceMetrics(): Promise<{
    accuracy: number[];
    loss: number[];
    driftEvents: number;
    updateTimes: number[];
  }> {
    return {
      accuracy: this.metrics.map(m => m.accuracy),
      loss: this.metrics.map(m => m.loss),
      driftEvents: this.metrics.filter(m => m.driftDetection.detected).length,
      updateTimes: this.metrics.map(m => m.updateTime)
    };
  }
} 