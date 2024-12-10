import * as tf from '@tensorflow/tfjs';
import { LocalDatabase, createDatabase } from '../utils/local-database';

interface MetaTask {
  id: string;
  name: string;
  type: 'classification' | 'regression';
  samples: number;
  supportSize: number;
  querySize: number;
}

interface MetaConfig {
  innerLearningRate: number;
  outerLearningRate: number;
  innerSteps: number;
  outerSteps: number;
  metaBatchSize: number;
  adaptationSteps: number;
}

export class MetaLearningService {
  private db: LocalDatabase;
  private metaModel: tf.LayersModel | null = null;
  private tasks: Map<string, MetaTask> = new Map();
  private config: MetaConfig;

  constructor() {
    this.db = createDatabase('meta-learning');
    this.config = {
      innerLearningRate: 0.01,
      outerLearningRate: 0.001,
      innerSteps: 5,
      outerSteps: 1000,
      metaBatchSize: 4,
      adaptationSteps: 10
    };
    this.initialize();
  }

  private async initialize() {
    await this.loadModel();
  }

  // 添加元学习任务
  async addTask(task: MetaTask): Promise<void> {
    this.tasks.set(task.id, task);
  }

  // 构建元模型
  private async buildMetaModel(): Promise<tf.LayersModel> {
    const model = tf.sequential();
    
    // 特征提取器
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [this.getInputShape()]
    }));
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    // 任务适应层
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    // 输出层
    model.add(tf.layers.dense({
      units: this.getOutputShape(),
      activation: 'softmax'
    }));

    return model;
  }

  // MAML训练步骤
  private async mamlStep(
    supportSet: tf.Tensor[],
    querySet: tf.Tensor[],
    innerSteps: number
  ): Promise<tf.Scalar> {
    return tf.tidy(() => {
      // 克隆模型参数
      const clonedParams = this.metaModel!.getWeights().map(w => w.clone());
      
      // 内循环优化
      for (let i = 0; i < innerSteps; i++) {
        const supportLoss = this.computeTaskLoss(supportSet[0], supportSet[1]);
        const gradFunc = (...args: tf.Tensor[]) => supportLoss;
        const grads = tf.grads(gradFunc)([supportSet[0]]);
        
        // 更新克隆的参数
        clonedParams.forEach((param, j) => {
          const update = grads[j].mul(this.config.innerLearningRate);
          param.sub(update);
        });
      }

      // 在查询集上评估
      const queryLoss = this.computeTaskLoss(querySet[0], querySet[1]);
      return queryLoss;
    });
  }

  // 计算任务损失
  private computeTaskLoss(x: tf.Tensor, y: tf.Tensor): tf.Scalar {
    return tf.tidy(() => {
      const predictions = this.metaModel!.predict(x) as tf.Tensor;
      return tf.losses.softmaxCrossEntropy(y, predictions).mean() as tf.Scalar;
    });
  }

  // 元训练
  async metaTrain(
    tasks: Array<{
      support: { x: tf.Tensor; y: tf.Tensor };
      query: { x: tf.Tensor; y: tf.Tensor };
    }>
  ): Promise<void> {
    if (!this.metaModel) {
      this.metaModel = await this.buildMetaModel();
    }

    const optimizer = tf.train.adam(this.config.outerLearningRate);

    for (let step = 0; step < this.config.outerSteps; step++) {
      const taskBatch = this.sampleTasks(tasks, this.config.metaBatchSize);
      
      const losses = await Promise.all(
        taskBatch.map(task => 
          this.mamlStep(
            [task.support.x, task.support.y],
            [task.query.x, task.query.y],
            this.config.innerSteps
          )
        )
      );

      const totalLossScalar = tf.tidy(() => tf.stack(losses).mean());

      // 更新元模型
      const gradFunc = (...args: tf.Tensor[]) => totalLossScalar as tf.Tensor;
      const inputTensor = tf.tensor1d([1.0]);
      const grads = tf.grads(gradFunc)([inputTensor]);
      
      const namedGrads = this.metaModel.trainableWeights.map((w, i) => ({
        name: w.name,
        tensor: grads[i]
      }));
      
      optimizer.applyGradients(namedGrads);

      // 记录训练进度
      if (step % 10 === 0) {
        const lossValue = await totalLossScalar.array();
        console.log(`Meta-step ${step}, Loss: ${lossValue}`);
      }

      // 清理临时张量
      totalLossScalar.dispose();
      losses.forEach(loss => loss.dispose());
      inputTensor.dispose();
      grads.forEach(grad => grad.dispose());
    }
  }

  // 快速适应
  async adapt(
    task: {
      support: { x: tf.Tensor; y: tf.Tensor };
      query: { x: tf.Tensor; y: tf.Tensor };
    }
  ): Promise<tf.LayersModel> {
    if (!this.metaModel) {
      throw new Error('元模型未初始化');
    }

    // 克隆元模型
    const adaptedModel = tf.sequential();
    const weights = this.metaModel.getWeights().map(w => w.clone());
    adaptedModel.setWeights(weights);

    // 在支持集上适应
    for (let i = 0; i < this.config.adaptationSteps; i++) {
      const loss = this.computeTaskLoss(task.support.x, task.support.y);
      const grads = tf.grads(() => loss);
      
      // 更新适应后的模型
      const newWeights = adaptedModel.getWeights().map((w, j) => {
        const update = grads[j].mul(this.config.innerLearningRate);
        return w.sub(update);
      });
      adaptedModel.setWeights(newWeights);
    }

    return adaptedModel;
  }

  // 采样任务
  private sampleTasks(tasks: any[], batchSize: number): any[] {
    const indices = Array.from(tf.util.createShuffledIndices(tasks.length));
    return indices.slice(0, batchSize).map(i => tasks[i]);
  }

  // 获取输入形状
  private getInputShape(): number {
    return 784; // 示例值
  }

  // 获取输出形状
  private getOutputShape(): number {
    return 10; // 示例值
  }

  // 保存模型
  private async saveModel(): Promise<void> {
    if (!this.metaModel) return;
    await this.metaModel.save('indexeddb://meta-model');
    await this.db.put('meta-config', this.config);
  }

  // 加载模型
  private async loadModel(): Promise<void> {
    try {
      this.metaModel = await tf.loadLayersModel('indexeddb://meta-model');
      const config = await this.db.get('meta-config');
      if (config) {
        this.config = config;
      }
    } catch (error) {
      console.error('加载元模型失败:', error);
    }
  }

  // 评估元学习性能
  async evaluateMetaLearning(
    tasks: Array<{
      support: { x: tf.Tensor; y: tf.Tensor };
      query: { x: tf.Tensor; y: tf.Tensor };
    }>
  ): Promise<{
    averageAccuracy: number;
    adaptationSpeed: number;
    generalization: number;
  }> {
    const results = await Promise.all(
      tasks.map(async task => {
        const adaptedModel = await this.adapt(task);
        const evaluation = await adaptedModel.evaluate(
          task.query.x,
          task.query.y
        ) as tf.Scalar[];
        
        return {
          accuracy: evaluation[1].dataSync()[0],
          adaptationTime: 0, // 需要实现计时逻辑
          queryLoss: evaluation[0].dataSync()[0]
        };
      })
    );

    return {
      averageAccuracy: results.reduce((acc, r) => acc + r.accuracy, 0) / results.length,
      adaptationSpeed: results.reduce((acc, r) => acc + r.adaptationTime, 0) / results.length,
      generalization: results.reduce((acc, r) => acc + r.queryLoss, 0) / results.length
    };
  }
} 