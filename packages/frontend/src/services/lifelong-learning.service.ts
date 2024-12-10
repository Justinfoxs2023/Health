import * as tf from '@tensorflow/tfjs';
import { LocalDatabase, createDatabase } from '../utils/local-database';

interface TaskMemory {
  id: string;
  type: string;
  samples: Array<{x: tf.Tensor, y: tf.Tensor}>;
  importance: number;
  performance: {
    accuracy: number;
    loss: number;
  };
}

interface LifelongConfig {
  maxTaskMemory: number;
  replayBufferSize: number;
  consolidationRate: number;
  forgettingThreshold: number;
  adaptiveParams: {
    learningRate: number;
    regularization: number;
  };
}

export class LifelongLearningService {
  private db: LocalDatabase;
  private model: tf.LayersModel | null = null;
  private taskMemories: Map<string, TaskMemory> = new Map();
  private config: LifelongConfig;
  private elasticWeights: Map<string, tf.Tensor> = new Map();

  constructor() {
    this.db = createDatabase('lifelong-learning');
    this.config = {
      maxTaskMemory: 5,
      replayBufferSize: 1000,
      consolidationRate: 0.5,
      forgettingThreshold: 0.2,
      adaptiveParams: {
        learningRate: 0.001,
        regularization: 0.1
      }
    };
    this.initialize();
  }

  private async initialize() {
    await this.loadModel();
    await this.loadTaskMemories();
  }

  // 学习新任务
  async learnNewTask(
    taskId: string,
    taskType: string,
    data: {x: tf.Tensor, y: tf.Tensor}[]
  ): Promise<void> {
    // 检查是否需要遗忘旧任务
    await this.manageTaskMemory();

    // 准备任务数据
    const taskData = this.prepareTaskData(data);

    // 使用弹性权重正则化进行训练
    await this.trainWithElasticRegularization(taskData);

    // 更新任务记忆
    await this.updateTaskMemory(taskId, taskType, data);

    // 巩固知识
    await this.consolidateKnowledge();
  }

  // 管理任务记忆
  private async manageTaskMemory(): Promise<void> {
    if (this.taskMemories.size >= this.config.maxTaskMemory) {
      // 找到最不重要的任务
      const leastImportantTask = Array.from(this.taskMemories.entries())
        .sort((a, b) => a[1].importance - b[1].importance)[0];

      // 执行选择性遗忘
      await this.forgetTask(leastImportantTask[0]);
    }
  }

  // 准备任务数据
  private prepareTaskData(
    data: {x: tf.Tensor, y: tf.Tensor}[]
  ): {x: tf.Tensor, y: tf.Tensor}[] {
    // 添加回放缓冲区的数据
    const replayData = this.sampleFromReplayBuffer();
    return [...data, ...replayData];
  }

  // 使用弹性权重正则化进行训练
  private async trainWithElasticRegularization(
    data: {x: tf.Tensor, y: tf.Tensor}[]
  ): Promise<void> {
    if (!this.model) {
      this.model = await this.buildModel();
    }

    // 保存当前权重作为参考
    const referenceWeights = this.model.getWeights().map(w => w.clone());

    // 添加弹性正则化损失
    const customLoss = (yTrue: tf.Tensor, yPred: tf.Tensor) => {
      const baseLoss = tf.losses.categoricalCrossentropy(yTrue, yPred);
      const elasticLoss = this.computeElasticLoss(referenceWeights);
      return baseLoss.add(elasticLoss.mul(this.config.adaptiveParams.regularization));
    };

    // 训练模型
    await this.model.fit(
      tf.concat(data.map(d => d.x)),
      tf.concat(data.map(d => d.y)),
      {
        epochs: 10,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: this.createCallbacks()
      }
    );

    // 更新弹性权重
    this.updateElasticWeights(referenceWeights);
  }

  // 计算弹性损失
  private computeElasticLoss(referenceWeights: tf.Tensor[]): tf.Scalar {
    return tf.tidy(() => {
      const currentWeights = this.model!.getWeights();
      const elasticLosses = currentWeights.map((w, i) => {
        const diff = w.sub(referenceWeights[i]);
        const importance = this.elasticWeights.get(w.name) || tf.ones(w.shape);
        return diff.square().mul(importance).mean();
      });
      return tf.add(elasticLosses).mean() as tf.Scalar;
    });
  }

  // 更新弹性权重
  private updateElasticWeights(referenceWeights: tf.Tensor[]): void {
    const currentWeights = this.model!.getWeights();
    currentWeights.forEach((w, i) => {
      const oldImportance = this.elasticWeights.get(w.name) || tf.zeros(w.shape);
      const newImportance = this.computeParameterImportance(w, referenceWeights[i]);
      this.elasticWeights.set(w.name, oldImportance.add(newImportance));
    });
  }

  // 计算参数重要性
  private computeParameterImportance(
    current: tf.Tensor,
    reference: tf.Tensor
  ): tf.Tensor {
    return tf.tidy(() => {
      const diff = current.sub(reference);
      return diff.square().reciprocal();
    });
  }

  // 巩固知识
  private async consolidateKnowledge(): Promise<void> {
    // 从所有任务中采样数据
    const consolidationData = this.sampleForConsolidation();

    // 使用知识蒸馏进行训练
    await this.distillKnowledge(consolidationData);

    // 更新任务性能
    await this.evaluateAllTasks();
  }

  // 选择性遗忘
  private async forgetTask(taskId: string): Promise<void> {
    const task = this.taskMemories.get(taskId);
    if (!task) return;

    // 减少相关权重的重要性
    this.reduceWeightImportance(task);

    // 从记忆中移除任务
    this.taskMemories.delete(taskId);

    // 更新模型
    await this.retrainWithoutTask(taskId);
  }

  // 创建回调
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
    await this.model.save('indexeddb://lifelong-model');
    await this.db.put('task-memories', Array.from(this.taskMemories.entries()));
    await this.db.put('elastic-weights', Array.from(this.elasticWeights.entries()));
  }

  private async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel('indexeddb://lifelong-model');
      const memories = await this.db.get('task-memories');
      if (memories) {
        this.taskMemories = new Map(memories);
      }
      const weights = await this.db.get('elastic-weights');
      if (weights) {
        this.elasticWeights = new Map(weights);
      }
    } catch (error) {
      console.error('加载终身学习模型失败:', error);
    }
  }
} 