import * as tf from '@tensorflow/tfjs';
import { ILocalDatabase } from '../utils/local-database';

interface IncrementalConfig {
  /** batchSize 的描述 */
  batchSize: number;
  /** learningRate 的描述 */
  learningRate: number;
  /** memorySize 的描述 */
  memorySize: number;
  /** updateThreshold 的描述 */
  updateThreshold: number;
  /** regularization 的描述 */
  regularization: {
    type: 'l1' | 'l2' | 'elastic';
    lambda: number;
  };
}

interface IncrementalResult {
  /** modelVersion 的描述 */
  modelVersion: number;
  /** performance 的描述 */
  performance: {
    accuracy: number;
    loss: number;
    catastrophicForgetting: number;
  };
  /** updateMetrics 的描述 */
  updateMetrics: {
    dataIncorporated: number;
    knowledgeRetention: number;
    adaptationSpeed: number;
  };
}

export class IncrementalLearningService {
  private db: ILocalDatabase;
  private model: tf.LayersModel | null = null;
  private config: IncrementalConfig;
  private memoryBuffer: Array<{
    data: tf.Tensor;
    label: tf.Tensor;
    importance: number;
  }> = [];
  private modelVersion = 0;

  constructor() {
    this.db = new LocalDatabase('incremental-learning');
    this.config = {
      batchSize: 32,
      learningRate: 0.001,
      memorySize: 1000,
      updateThreshold: 0.1,
      regularization: {
        type: 'elastic',
        lambda: 0.01,
      },
    };
    this.initialize();
  }

  private async initialize() {
    await this.loadModel();
    await this.loadMemoryBuffer();
  }

  private async loadModel() {
    try {
      const savedModel = await this.db.get('current-model');
      if (savedModel) {
        this.model = await tf.loadLayersModel(savedModel);
        this.modelVersion = (await this.db.get('model-version')) || 0;
      }
    } catch (error) {
      console.error('Error in incremental-learning.service.ts:', '加载模型失败:', error);
    }
  }

  // 增量更新
  async update(newData: tf.Tensor, newLabels: tf.Tensor): Promise<IncrementalResult> {
    try {
      // 评估新数据的重要性
      const importance = await this.evaluateDataImportance(newData, newLabels);

      // 更新记忆缓冲区
      await this.updateMemoryBuffer(newData, newLabels, importance);

      // 执行增量学习
      const updateResult = await this.performIncrementalUpdate();

      // 防止灾难性遗忘
      await this.preventCatastrophicForgetting();

      // 评估更新效果
      const performance = await this.evaluatePerformance();

      // 保存更新后的模型
      await this.saveModel();

      this.modelVersion++;

      return {
        modelVersion: this.modelVersion,
        performance,
        updateMetrics: {
          dataIncorporated: newData.shape[0],
          knowledgeRetention: performance.catastrophicForgetting,
          adaptationSpeed: updateResult.adaptationSpeed,
        },
      };
    } catch (error) {
      console.error('Error in incremental-learning.service.ts:', '增量更新失败:', error);
      throw error;
    }
  }

  // 评估数据重要性
  private async evaluateDataImportance(data: tf.Tensor, labels: tf.Tensor): Promise<number> {
    if (!this.model) return 0;

    // 计算预测不确定性
    const predictions = this.model.predict(data) as tf.Tensor;
    const uncertainty = tf.metrics.meanSquaredError(labels, predictions);

    // 计算样本多样性
    const diversity = await this.calculateSampleDiversity(data);

    // 计算与现有知识的差异性
    const novelty = await this.calculateNovelty(data);

    return tf.tidy(() => {
      const importanceScore = tf.add(
        tf.mul(uncertainty, 0.4),
        tf.add(tf.mul(diversity, 0.3), tf.mul(novelty, 0.3)),
      );
      return importanceScore.dataSync()[0];
    });
  }

  // 更新记忆缓冲区
  private async updateMemoryBuffer(
    data: tf.Tensor,
    labels: tf.Tensor,
    importance: number,
  ): Promise<void> {
    // 添加新样本
    this.memoryBuffer.push({
      data: data.clone(),
      label: labels.clone(),
      importance,
    });

    // 根据重要性排序
    this.memoryBuffer.sort((a, b) => b.importance - a.importance);

    // 维持缓冲区大小
    if (this.memoryBuffer.length > this.config.memorySize) {
      const removed = this.memoryBuffer.splice(
        this.config.memorySize,
        this.memoryBuffer.length - this.config.memorySize,
      );
      removed.forEach(item => {
        item.data.dispose();
        item.label.dispose();
      });
    }
  }

  // 执行增量更新
  private async performIncrementalUpdate(): Promise<{
    adaptationSpeed: number;
  }> {
    if (!this.model || this.memoryBuffer.length === 0) {
      throw new Error('模型或数据未准备好');
    }

    const startTime = Date.now();

    // 准备训练数据
    const batchData = this.prepareBatchData();

    // 应用正则化
    const regularizedModel = this.applyRegularization(this.model);

    // 执行训练
    await regularizedModel.fit(batchData.x, batchData.y, {
      epochs: 1,
      batchSize: this.config.batchSize,
      validationSplit: 0.2,
    });

    const adaptationSpeed = Date.now() - startTime;
    this.model = regularizedModel;

    return { adaptationSpeed };
  }

  // 防止灾难性遗忘
  private async preventCatastrophicForgetting(): Promise<void> {
    if (!this.model) return;

    // 知识蒸馏
    const oldPredictions = await this.getOldModelPredictions();

    // 弹性权重整合
    await this.elasticWeightConsolidation();

    // 经验重放
    await this.experienceReplay();
  }

  // 评估性能
  private async evaluatePerformance(): Promise<{
    accuracy: number;
    loss: number;
    catastrophicForgetting: number;
  }> {
    if (!this.model) {
      throw new Error('模型未加载');
    }

    // 在验证集上评估
    const validationData = await this.getValidationData();
    const evaluation = await this.model.evaluate(validationData.x, validationData.y);

    // 计算灾难性遗忘指标
    const forgetting = await this.calculateForgetting();

    return {
      accuracy: (evaluation[1] as tf.Scalar).dataSync()[0],
      loss: (evaluation[0] as tf.Scalar).dataSync()[0],
      catastrophicForgetting: forgetting,
    };
  }

  // 保存模型
  private async saveModel(): Promise<void> {
    if (!this.model) return;

    await this.model.save('indexeddb://incremental-model');
    await this.db.put('model-version', this.modelVersion);
    await this.saveMemoryBuffer();
  }

  // 保存记忆缓冲区
  private async saveMemoryBuffer(): Promise<void> {
    const serializedBuffer = this.memoryBuffer.map(item => ({
      data: item.data.arraySync(),
      label: item.label.arraySync(),
      importance: item.importance,
    }));
    await this.db.put('memory-buffer', serializedBuffer);
  }

  // 加载记忆缓冲区
  private async loadMemoryBuffer(): Promise<void> {
    const savedBuffer = await this.db.get('memory-buffer');
    if (savedBuffer) {
      this.memoryBuffer = savedBuffer.map(item => ({
        data: tf.tensor(item.data),
        label: tf.tensor(item.label),
        importance: item.importance,
      }));
    }
  }

  // 获取当前模型
  async getCurrentModel(): Promise<tf.LayersModel | null> {
    return this.model;
  }

  // 更新配置
  async updateConfig(config: Partial<IncrementalConfig>): Promise<void> {
    this.config = {
      ...this.config,
      ...config,
    };
    await this.db.put('incremental-config', this.config);
  }

  // 分析学习效果
  async analyzeLearningEffect(): Promise<{
    metrics: any;
    recommendations: string[];
  }> {
    const performance = await this.evaluatePerformance();
    const memoryUtilization = this.analyzeMemoryUtilization();

    return {
      metrics: {
        ...performance,
        memoryUtilization,
      },
      recommendations: this.generateRecommendations(performance),
    };
  }

  // 生成优化建议
  private generateRecommendations(performance: any): string[] {
    const recommendations: string[] = [];

    if (performance.catastrophicForgetting > 0.2) {
      recommendations.push('建议增加记忆缓冲区大小以减少遗忘');
    }

    if (performance.accuracy < 0.8) {
      recommendations.push('考虑调整学习率或增加训练轮次');
    }

    return recommendations;
  }
}
