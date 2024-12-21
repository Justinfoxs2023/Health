import * as tf from '@tensorflow/tfjs';
import { ILocalDatabase, createDatabase } from '../utils/local-database';

interface ITaskConfig {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** type 的描述 */
  type: 'classification' | 'regression';
  /** outputUnits 的描述 */
  outputUnits: number;
  /** lossWeight 的描述 */
  lossWeight: number;
  /** metrics 的描述 */
  metrics: string[];
}

interface IMultiTaskConfig {
  /** sharedLayers 的描述 */
  sharedLayers: number[];
  /** taskSpecificLayers 的描述 */
  taskSpecificLayers: number[];
  /** learningRate 的描述 */
  learningRate: number;
  /** batchSize 的描述 */
  batchSize: number;
  /** epochs 的描述 */
  epochs: number;
}

export class MultiTaskLearningService {
  private db: ILocalDatabase;
  private model: tf.LayersModel | null = null;
  private tasks: Map<string, ITaskConfig> = new Map();
  private config: IMultiTaskConfig;

  constructor() {
    this.db = createDatabase('multi-task-learning');
    this.config = {
      sharedLayers: [256, 128],
      taskSpecificLayers: [64, 32],
      learningRate: 0.001,
      batchSize: 32,
      epochs: 100,
    };
  }

  // 添加任务
  async addTask(taskConfig: ITaskConfig): Promise<void> {
    this.tasks.set(taskConfig.id, taskConfig);
    await this.rebuildModel();
  }

  // 构建多任务模型
  private async buildModel(): Promise<tf.LayersModel> {
    const input = tf.input({ shape: [this.getInputShape()] });
    let shared = input;

    // 共享层
    for (const units of this.config.sharedLayers) {
      shared = tf.layers
        .dense({
          units,
          activation: 'relu',
        })
        .apply(shared) as tf.SymbolicTensor;
    }

    // 任务特定层和输出
    const outputs: tf.SymbolicTensor[] = [];
    for (const task of this.tasks.values()) {
      let taskSpecific = shared;

      // 任务特定层
      for (const units of this.config.taskSpecificLayers) {
        taskSpecific = tf.layers
          .dense({
            units,
            activation: 'relu',
          })
          .apply(taskSpecific) as tf.SymbolicTensor;
      }

      // 输出层
      const output = tf.layers
        .dense({
          units: task.outputUnits,
          activation: task.type === 'classification' ? 'softmax' : 'linear',
          name: `output_${task.id}`,
        })
        .apply(taskSpecific) as tf.SymbolicTensor;

      outputs.push(output);
    }

    // 创建模型
    const model = tf.model({
      inputs: input,
      outputs: outputs,
    });

    // 编译模型
    const losses = Array.from(this.tasks.values()).reduce((acc, task) => {
      acc[`output_${task.id}`] =
        task.type === 'classification' ? 'categoricalCrossentropy' : 'meanSquaredError';
      return acc;
    }, {} as { [key: string]: string });

    const lossWeights = Array.from(this.tasks.values()).reduce((acc, task) => {
      acc[`output_${task.id}`] = task.lossWeight;
      return acc;
    }, {} as { [key: string]: number });

    model.compile({
      optimizer: tf.train.adam(this.config.learningRate),
      loss: losses,
      lossWeights,
      metrics: ['accuracy'],
    });

    return model;
  }

  // 训练模型
  async train(data: { [taskId: string]: { x: tf.Tensor; y: tf.Tensor } }): Promise<tf.History> {
    if (!this.model) {
      this.model = await this.buildModel();
    }

    const xs = Object.values(data)[0].x; // 假设所有任务共享相同的输入
    const ys = Object.fromEntries(
      Array.from(this.tasks.keys()).map(taskId => [`output_${taskId}`, data[taskId].y]),
    );

    return await this.model.fit(xs, ys, {
      epochs: this.config.epochs,
      batchSize: this.config.batchSize,
      validationSplit: 0.2,
      callbacks: this.createCallbacks(),
    });
  }

  // 预测
  async predict(input: tf.Tensor): Promise<{ [taskId: string]: tf.Tensor }> {
    if (!this.model) {
      throw new Error('模型未初始化');
    }

    const predictions = (await this.model.predict(input)) as tf.Tensor[];
    return Object.fromEntries(
      Array.from(this.tasks.keys()).map((taskId, index) => [taskId, predictions[index]]),
    );
  }

  // 评估模型
  async evaluate(data: {
    [taskId: string]: { x: tf.Tensor; y: tf.Tensor };
  }): Promise<{ [taskId: string]: number }> {
    if (!this.model) {
      throw new Error('模型未初始化');
    }

    const xs = Object.values(data)[0].x;
    const ys = Object.fromEntries(
      Array.from(this.tasks.keys()).map(taskId => [`output_${taskId}`, data[taskId].y]),
    );

    const evaluation = (await this.model.evaluate(xs, ys)) as tf.Scalar[];
    return Object.fromEntries(
      Array.from(this.tasks.keys()).map((taskId, index) => [
        taskId,
        evaluation[index].dataSync()[0],
      ]),
    );
  }

  // 创建回调
  private createCallbacks(): tf.CustomCallbackArgs[] {
    return [
      {
        onEpochEnd: async (epoch, logs) => {
          console.log(`Epoch ${epoch}:`, logs);
        },
      },
    ];
  }

  // 获取输入形状
  private getInputShape(): number {
    // 实现获取输入形状的逻辑
    return 784; // 示例值
  }

  // 保存模型
  private async saveModel(): Promise<void> {
    if (!this.model) return;
    await this.model.save('indexeddb://multi-task-model');
    await this.db.put('tasks', Array.from(this.tasks.entries()));
  }

  // 加载模型
  private async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel('indexeddb://multi-task-model');
      const tasks = await this.db.get('tasks');
      if (tasks) {
        this.tasks = new Map(tasks);
      }
    } catch (error) {
      console.error('Error in multi-task-learning.service.ts:', '加载模型失败:', error);
    }
  }

  // 重建模型
  private async rebuildModel(): Promise<void> {
    this.model = await this.buildModel();
    await this.saveModel();
  }
}
