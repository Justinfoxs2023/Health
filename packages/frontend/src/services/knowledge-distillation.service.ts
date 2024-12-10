import * as tf from '@tensorflow/tfjs';
import { LocalDatabase, createDatabase } from '../utils/local-database';

interface DistillationConfig {
  temperature: number;
  alpha: number;  // 软标签和硬标签的权重平衡
  teacherModelPath: string;
  studentArchitecture: {
    layers: Array<{
      type: string;
      units?: number;
      activation?: string;
      kernelSize?: number[];
    }>;
  };
  training: {
    epochs: number;
    batchSize: number;
    learningRate: number;
    distillationLoss: 'kl' | 'mse' | 'cosine';
  };
}

interface DistillationResult {
  compressionRatio: number;
  accuracyTeacher: number;
  accuracyStudent: number;
  latencyImprovement: number;
  metrics: {
    loss: number[];
    distillationLoss: number[];
    studentAccuracy: number[];
  };
}

export class KnowledgeDistillationService {
  private db: LocalDatabase;
  private teacherModel: tf.LayersModel | null = null;
  private studentModel: tf.LayersModel | null = null;
  private config: DistillationConfig;

  constructor() {
    this.db = createDatabase('knowledge-distillation');
    this.config = {
      temperature: 3.0,
      alpha: 0.7,
      teacherModelPath: 'indexeddb://teacher-model',
      studentArchitecture: {
        layers: [
          { type: 'dense', units: 128, activation: 'relu' },
          { type: 'dense', units: 64, activation: 'relu' },
          { type: 'dense', units: 10, activation: 'softmax' }
        ]
      },
      training: {
        epochs: 100,
        batchSize: 32,
        learningRate: 0.001,
        distillationLoss: 'kl'
      }
    };
  }

  // 初始化蒸馏过程
  async initializeDistillation(
    teacherModel: tf.LayersModel
  ): Promise<void> {
    this.teacherModel = teacherModel;
    this.studentModel = await this.buildStudentModel();
  }

  // 执行知识蒸馏
  async performDistillation(
    data: { x: tf.Tensor; y: tf.Tensor },
    validationData?: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<DistillationResult> {
    if (!this.teacherModel || !this.studentModel) {
      throw new Error('模型未初始化');
    }

    // 生成软标签
    const softLabels = await this.generateSoftLabels(data.x);

    // 训练学生模型
    const history = await this.trainStudentModel(
      data,
      softLabels,
      validationData
    );

    // 评估结果
    const result = await this.evaluateDistillation(
      data,
      validationData
    );

    await this.saveDistillationResult(result);
    return result;
  }

  // 生成软标签
  private async generateSoftLabels(input: tf.Tensor): Promise<tf.Tensor> {
    return tf.tidy(() => {
      const logits = this.teacherModel!.predict(input) as tf.Tensor;
      return tf.softmax(logits.div(tf.scalar(this.config.temperature)));
    });
  }

  // 构建学生模型
  private async buildStudentModel(): Promise<tf.LayersModel> {
    const model = tf.sequential();

    for (const layerConfig of this.config.studentArchitecture.layers) {
      switch (layerConfig.type) {
        case 'dense':
          model.add(tf.layers.dense({
            units: layerConfig.units!,
            activation: layerConfig.activation
          }));
          break;
        case 'conv2d':
          model.add(tf.layers.conv2d({
            filters: layerConfig.units!,
            kernelSize: layerConfig.kernelSize!,
            activation: layerConfig.activation
          }));
          break;
        // 添加其他层类型
      }
    }

    model.compile({
      optimizer: tf.train.adam(this.config.training.learningRate),
      loss: this.createDistillationLoss(),
      metrics: ['accuracy']
    });

    return model;
  }

  // 创建蒸馏损失函数
  private createDistillationLoss(): tf.LossOrMetricFn {
    return (yTrue: tf.Tensor, yPred: tf.Tensor) => {
      return tf.tidy(() => {
        // 分离硬标签和软标签
        const hardLabels = yTrue.slice([0, 0], [-1, yTrue.shape[1] / 2]);
        const softLabels = yTrue.slice([0, yTrue.shape[1] / 2], [-1, -1]);

        // 计算蒸馏损失
        let distillationLoss: tf.Tensor;
        switch (this.config.training.distillationLoss) {
          case 'kl':
            distillationLoss = tf.losses.kullbackLeiblerDivergence(softLabels, yPred);
            break;
          case 'mse':
            distillationLoss = tf.losses.meanSquaredError(softLabels, yPred);
            break;
          case 'cosine':
            const normalized1 = tf.div(softLabels, tf.norm(softLabels));
            const normalized2 = tf.div(yPred, tf.norm(yPred));
            distillationLoss = tf.sub(1, tf.sum(tf.mul(normalized1, normalized2)));
            break;
        }

        // 计算硬标签损失
        const hardLoss = tf.losses.categoricalCrossentropy(hardLabels, yPred);

        // 组合损失
        return tf.add(
          tf.mul(distillationLoss, tf.scalar(this.config.alpha)),
          tf.mul(hardLoss, tf.scalar(1 - this.config.alpha))
        );
      });
    };
  }

  // 训练学生模型
  private async trainStudentModel(
    data: { x: tf.Tensor; y: tf.Tensor },
    softLabels: tf.Tensor,
    validationData?: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<tf.History> {
    // 组合硬标签和软标签
    const combinedLabels = tf.concat([data.y, softLabels], 1);

    return await this.studentModel!.fit(data.x, combinedLabels, {
      epochs: this.config.training.epochs,
      batchSize: this.config.training.batchSize,
      validationData: validationData ? [
        validationData.x,
        tf.concat([validationData.y, this.generateSoftLabels(validationData.x)], 1)
      ] : undefined,
      callbacks: this.createDistillationCallbacks()
    });
  }

  // 评估蒸馏结果
  private async evaluateDistillation(
    data: { x: tf.Tensor; y: tf.Tensor },
    validationData?: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<DistillationResult> {
    const evalData = validationData || data;

    const teacherAccuracy = await this.evaluateModel(this.teacherModel!, evalData);
    const studentAccuracy = await this.evaluateModel(this.studentModel!, evalData);

    const compressionRatio = await this.calculateCompressionRatio();
    const latencyImprovement = await this.measureLatencyImprovement(evalData.x);

    return {
      compressionRatio,
      accuracyTeacher: teacherAccuracy,
      accuracyStudent: studentAccuracy,
      latencyImprovement,
      metrics: {
        loss: [],  // 从训练历史中获取
        distillationLoss: [],
        studentAccuracy: []
      }
    };
  }

  // 辅助方法
  private async evaluateModel(
    model: tf.LayersModel,
    data: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<number> {
    const result = await model.evaluate(data.x, data.y) as tf.Scalar[];
    return result[1].dataSync()[0];  // 返回准确率
  }

  private async calculateCompressionRatio(): Promise<number> {
    const teacherSize = this.calculateModelSize(this.teacherModel!);
    const studentSize = this.calculateModelSize(this.studentModel!);
    return teacherSize / studentSize;
  }

  private calculateModelSize(model: tf.LayersModel): number {
    let totalParams = 0;
    model.weights.forEach(weight => {
      totalParams += weight.size;
    });
    return totalParams * 4;  // 假设每个参数占4字节
  }

  private async measureLatencyImprovement(input: tf.Tensor): Promise<number> {
    const teacherTime = await this.measureInferenceTime(this.teacherModel!, input);
    const studentTime = await this.measureInferenceTime(this.studentModel!, input);
    return (teacherTime - studentTime) / teacherTime;
  }

  private async measureInferenceTime(
    model: tf.LayersModel,
    input: tf.Tensor
  ): Promise<number> {
    // 预热
    for (let i = 0; i < 10; i++) {
      await model.predict(input);
    }

    // 测量时间
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      await model.predict(input);
    }
    const end = performance.now();

    return (end - start) / 100;
  }

  private createDistillationCallbacks(): tf.CustomCallbackArgs[] {
    return [{
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
      }
    }];
  }

  // 保存蒸馏结果
  private async saveDistillationResult(result: DistillationResult): Promise<void> {
    await this.studentModel!.save('indexeddb://student-model');
    await this.db.put('distillation-result', result);
    await this.db.put('distillation-config', this.config);
  }

  // 加载蒸馏后的模型
  async loadStudentModel(): Promise<tf.LayersModel | null> {
    try {
      this.studentModel = await tf.loadLayersModel('indexeddb://student-model');
      return this.studentModel;
    } catch (error) {
      console.error('加载学生模型失败:', error);
      return null;
    }
  }
} 