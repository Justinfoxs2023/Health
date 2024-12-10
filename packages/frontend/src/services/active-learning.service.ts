import * as tf from '@tensorflow/tfjs';
import { LocalDatabase, createDatabase } from '../utils/local-database';

interface QueryStrategy {
  type: 'uncertainty' | 'diversity' | 'expected-improvement' | 'hybrid';
  params: {
    batchSize: number;
    uncertaintyThreshold?: number;
    diversityWeight?: number;
    explorationFactor?: number;
  };
}

interface ActiveLearningConfig {
  initialSampleSize: number;
  queryBudget: number;
  retrainingConfig: {
    epochs: number;
    batchSize: number;
    validationSplit: number;
  };
  strategy: QueryStrategy;
}

export class ActiveLearningService {
  private db: LocalDatabase;
  private model: tf.LayersModel | null = null;
  private labeledData: Array<{x: tf.Tensor, y: tf.Tensor}> = [];
  private unlabeledPool: tf.Tensor[] = [];
  private config: ActiveLearningConfig;

  constructor() {
    this.db = createDatabase('active-learning');
    this.config = {
      initialSampleSize: 100,
      queryBudget: 1000,
      retrainingConfig: {
        epochs: 10,
        batchSize: 32,
        validationSplit: 0.2
      },
      strategy: {
        type: 'hybrid',
        params: {
          batchSize: 10,
          uncertaintyThreshold: 0.7,
          diversityWeight: 0.3,
          explorationFactor: 0.1
        }
      }
    };
    this.initialize();
  }

  private async initialize() {
    await this.loadModel();
  }

  // 初始化数据池
  async initializePool(data: tf.Tensor[]): Promise<void> {
    this.unlabeledPool = data.map(x => x.clone());
  }

  // 查询最有价值的样本
  async queryInstances(): Promise<tf.Tensor[]> {
    if (!this.model || this.unlabeledPool.length === 0) {
      throw new Error('模型未初始化或无可用数据');
    }

    switch (this.config.strategy.type) {
      case 'uncertainty':
        return this.uncertaintySampling();
      case 'diversity':
        return this.diversitySampling();
      case 'expected-improvement':
        return this.expectedImprovementSampling();
      case 'hybrid':
        return this.hybridSampling();
      default:
        throw new Error('不支持的查询策略');
    }
  }

  // 不确定性采样
  private async uncertaintySampling(): Promise<tf.Tensor[]> {
    return tf.tidy(() => {
      // 获取预测概率
      const predictions = this.unlabeledPool.map(x => 
        this.model!.predict(x.expandDims()) as tf.Tensor
      );

      // 计算熵或置信度
      const uncertainties = predictions.map(pred => {
        const entropy = tf.sum(
          pred.mul(tf.log(pred.add(tf.scalar(1e-10)))).neg()
        );
        return entropy.dataSync()[0];
      });

      // 选择最不确定的样本
      const indices = this.getTopKIndices(
        uncertainties,
        this.config.strategy.params.batchSize
      );

      return indices.map(i => this.unlabeledPool[i].clone());
    });
  }

  // 多样性采样
  private async diversitySampling(): Promise<tf.Tensor[]> {
    return tf.tidy(() => {
      // 提取特征
      const features = this.unlabeledPool.map(x => 
        this.extractFeatures(x)
      );

      // 计算样本间距离
      const distances = this.computePairwiseDistances(features);

      // 使用最大最小距离选择样本
      const selectedIndices = this.maxMinSelection(
        distances,
        this.config.strategy.params.batchSize
      );

      return selectedIndices.map(i => this.unlabeledPool[i].clone());
    });
  }

  // 期望改进采样
  private async expectedImprovementSampling(): Promise<tf.Tensor[]> {
    return tf.tidy(() => {
      // 获取当前模型性能
      const baselinePerformance = this.evaluateModel();

      // 计算每个样本的期望改进
      const improvements = this.unlabeledPool.map(x => 
        this.estimateImprovement(x, baselinePerformance)
      );

      // 选择期望改进最大的样本
      const indices = this.getTopKIndices(
        improvements,
        this.config.strategy.params.batchSize
      );

      return indices.map(i => this.unlabeledPool[i].clone());
    });
  }

  // 混合采样策略
  private async hybridSampling(): Promise<tf.Tensor[]> {
    return tf.tidy(() => {
      const {
        uncertaintyThreshold,
        diversityWeight,
        explorationFactor
      } = this.config.strategy.params;

      // 计算不确定性分数
      const uncertaintyScores = this.computeUncertaintyScores();

      // 计算多样性分数
      const diversityScores = this.computeDiversityScores();

      // 计算探索分数
      const explorationScores = this.computeExplorationScores();

      // 组合分数
      const combinedScores = uncertaintyScores.map((u, i) => 
        u * (1 - diversityWeight - explorationFactor) +
        diversityScores[i] * diversityWeight +
        explorationScores[i] * explorationFactor
      );

      // 选择最高分的样本
      const indices = this.getTopKIndices(
        combinedScores,
        this.config.strategy.params.batchSize
      );

      return indices.map(i => this.unlabeledPool[i].clone());
    });
  }

  // 更新模型
  async updateModel(
    queries: tf.Tensor[],
    labels: tf.Tensor[]
  ): Promise<tf.History> {
    // 添加到已标注数据集
    queries.forEach((x, i) => {
      this.labeledData.push({
        x: x.clone(),
        y: labels[i].clone()
      });
    });

    // 从未标注池中移除
    const queryHashes = new Set(queries.map(x => this.hashTensor(x)));
    this.unlabeledPool = this.unlabeledPool.filter(x => 
      !queryHashes.has(this.hashTensor(x))
    );

    // 重新训练模型
    return await this.retrainModel();
  }

  // 重新训练模型
  private async retrainModel(): Promise<tf.History> {
    const {epochs, batchSize, validationSplit} = this.config.retrainingConfig;

    const xs = tf.concat(this.labeledData.map(d => d.x.expandDims()));
    const ys = tf.concat(this.labeledData.map(d => d.y.expandDims()));

    return await this.model!.fit(xs, ys, {
      epochs,
      batchSize,
      validationSplit,
      callbacks: this.createCallbacks()
    });
  }

  // 辅助方法
  private hashTensor(tensor: tf.Tensor): string {
    return tensor.dataSync().toString();
  }

  private getTopKIndices(array: number[], k: number): number[] {
    return array
      .map((value, index) => ({value, index}))
      .sort((a, b) => b.value - a.value)
      .slice(0, k)
      .map(item => item.index);
  }

  private createCallbacks(): tf.CustomCallbackArgs[] {
    return [{
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
      }
    }];
  }

  // 保存和加载
  private async saveModel(): Promise<void> {
    if (!this.model) return;
    await this.model.save('indexeddb://active-learning-model');
    await this.db.put('active-learning-config', this.config);
  }

  private async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel('indexeddb://active-learning-model');
      const config = await this.db.get('active-learning-config');
      if (config) {
        this.config = config;
      }
    } catch (error) {
      console.error('加载主动学习模型失败:', error);
    }
  }
} 