import * as tf from '@tensorflow/tfjs-node';
import { Logger } from '../../shared/utils/logger';
import { DataProcessor } from '../../shared/utils/data-processor';
import { HealthData } from '../../shared/types/health.types';

const logger = new Logger('VitalSignsModelTraining');

/**
 * 生命体征模型训练配置
 */
interface TrainingConfig {
  epochs: number;
  batchSize: number;
  validationSplit: number;
  learningRate: number;
  modelArchitecture: {
    hiddenLayers: number[];
    dropout: number;
  };
}

/**
 * 默认训练配置
 */
const defaultConfig: TrainingConfig = {
  epochs: 100,
  batchSize: 32,
  validationSplit: 0.2,
  learningRate: 0.001,
  modelArchitecture: {
    hiddenLayers: [64, 32, 16],
    dropout: 0.2
  }
};

/**
 * 生命体征模型训练类
 */
export class VitalSignsModelTrainer {
  private readonly dataProcessor: DataProcessor;
  private model: tf.LayersModel | null = null;

  constructor(private readonly config: TrainingConfig = defaultConfig) {
    this.dataProcessor = new DataProcessor();
  }

  /**
   * 创建模型
   */
  private createModel(inputShape: number): tf.LayersModel {
    const model = tf.sequential();

    // 输入层
    model.add(tf.layers.dense({
      units: this.config.modelArchitecture.hiddenLayers[0],
      activation: 'relu',
      inputShape: [inputShape]
    }));

    // 隐藏层
    for (let i = 1; i < this.config.modelArchitecture.hiddenLayers.length; i++) {
      model.add(tf.layers.dropout({ rate: this.config.modelArchitecture.dropout }));
      model.add(tf.layers.dense({
        units: this.config.modelArchitecture.hiddenLayers[i],
        activation: 'relu'
      }));
    }

    // 输出层
    model.add(tf.layers.dense({
      units: 5, // 总分 + 4个类别分数
      activation: 'sigmoid'
    }));

    // 编译模型
    model.compile({
      optimizer: tf.train.adam(this.config.learningRate),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * 准备训练数据
   */
  private async prepareData(data: HealthData[]): Promise<{
    trainFeatures: tf.Tensor2D;
    trainLabels: tf.Tensor2D;
  }> {
    try {
      const processedData = await Promise.all(
        data.map(d => this.dataProcessor.processHealthData(d))
      );

      const features = processedData.map(d => d.features.flat());
      const labels = this.generateLabels(data);

      return {
        trainFeatures: tf.tensor2d(features),
        trainLabels: tf.tensor2d(labels)
      };
    } catch (error) {
      logger.error('准备训练数据失败', error);
      throw error;
    }
  }

  /**
   * 生成标签
   */
  private generateLabels(data: HealthData[]): number[][] {
    return data.map(d => {
      // 根据生命体征数据生成标签
      const bpScore = this.calculateBPScore(d.physicalData.bloodPressure);
      const hrScore = this.calculateHRScore(d.physicalData.heartRate);
      const tempScore = this.calculateTempScore(d.physicalData.bodyTemperature);
      const oxygenScore = this.calculateOxygenScore(d.physicalData.bloodOxygen);
      
      // 计算总分
      const overallScore = (bpScore + hrScore + tempScore + oxygenScore) / 4;

      return [overallScore, bpScore, hrScore, tempScore, oxygenScore];
    });
  }

  /**
   * 计算血压评分
   */
  private calculateBPScore(bp: { systolic: number; diastolic: number }): number {
    const systolicScore = this.normalizeInRange(bp.systolic, 90, 140);
    const diastolicScore = this.normalizeInRange(bp.diastolic, 60, 90);
    return (systolicScore + diastolicScore) / 2;
  }

  /**
   * 计算心率评分
   */
  private calculateHRScore(heartRate: number): number {
    return this.normalizeInRange(heartRate, 60, 100);
  }

  /**
   * 计算体温评分
   */
  private calculateTempScore(temperature: number): number {
    return this.normalizeInRange(temperature, 36.3, 37.3);
  }

  /**
   * 计算血氧评分
   */
  private calculateOxygenScore(oxygen: number): number {
    return this.normalizeInRange(oxygen, 95, 100);
  }

  /**
   * 范围归一化
   */
  private normalizeInRange(value: number, min: number, max: number): number {
    if (value < min) return 1 - Math.min(1, (min - value) / min);
    if (value > max) return 1 - Math.min(1, (value - max) / max);
    return 1;
  }

  /**
   * 训练模型
   */
  async train(data: HealthData[]): Promise<tf.History> {
    try {
      logger.info('开始训练模型', {
        dataSize: data.length,
        config: this.config
      });

      const { trainFeatures, trainLabels } = await this.prepareData(data);
      
      // 创建模型
      this.model = this.createModel(trainFeatures.shape[1]);

      // 训练模型
      const history = await this.model.fit(trainFeatures, trainLabels, {
        epochs: this.config.epochs,
        batchSize: this.config.batchSize,
        validationSplit: this.config.validationSplit,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            logger.debug('训练进度', { epoch, ...logs });
          }
        }
      });

      logger.info('模型训练完���', {
        finalLoss: history.history.loss[history.history.loss.length - 1],
        finalAccuracy: history.history.acc[history.history.acc.length - 1]
      });

      // 保存模型
      await this.saveModel();

      return history;
    } catch (error) {
      logger.error('模型训练失败', error);
      throw error;
    }
  }

  /**
   * 保存模型
   */
  private async saveModel(): Promise<void> {
    try {
      if (!this.model) {
        throw new Error('模型未训练');
      }

      const saveResult = await this.model.save('file://./models/vital-signs');
      logger.info('模型保存成功', { saveResult });
    } catch (error) {
      logger.error('模型保存失败', error);
      throw error;
    }
  }

  /**
   * 评估模型
   */
  async evaluate(testData: HealthData[]): Promise<{
    loss: number;
    accuracy: number;
  }> {
    try {
      if (!this.model) {
        throw new Error('模型未训练');
      }

      const { trainFeatures, trainLabels } = await this.prepareData(testData);
      const result = await this.model.evaluate(trainFeatures, trainLabels);

      return {
        loss: (result as tf.Scalar[])[0].dataSync()[0],
        accuracy: (result as tf.Scalar[])[1].dataSync()[0]
      };
    } catch (error) {
      logger.error('模型评估失败', error);
      throw error;
    }
  }
} 