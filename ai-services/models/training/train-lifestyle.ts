import * as tf from '@tensorflow/tfjs-node';
import { DataProcessor } from '../../shared/utils/data-processor';
import { IHealthData } from '../../shared/types/health.types';
import { Logger } from '../../shared/utils/logger';

const logger = new Logger('LifestyleModelTraining');

/**
 * 生活方式模型训练配置
 */
interface ITrainingConfig {
  /** epochs 的描述 */
  epochs: number;
  /** batchSize 的描述 */
  batchSize: number;
  /** validationSplit 的描述 */
  validationSplit: number;
  /** learningRate 的描述 */
  learningRate: number;
  /** modelArchitecture 的描述 */
  modelArchitecture: {
    hiddenLayers: number[];
    dropout: number;
  };
}

/**
 * 默认训练配置
 */
const defaultConfig: ITrainingConfig = {
  epochs: 100,
  batchSize: 32,
  validationSplit: 0.2,
  learningRate: 0.001,
  modelArchitecture: {
    hiddenLayers: [128, 64, 32],
    dropout: 0.3,
  },
};

/**
 * 生活方式模型训练类
 */
export class LifestyleModelTrainer {
  private readonly dataProcessor: DataProcessor;
  private model: tf.LayersModel | null = null;

  constructor(private readonly config: ITrainingConfig = defaultConfig) {
    this.dataProcessor = new DataProcessor();
  }

  /**
   * 创建模型
   */
  private createModel(inputShape: number): tf.LayersModel {
    const model = tf.sequential();

    // 输入层
    model.add(
      tf.layers.dense({
        units: this.config.modelArchitecture.hiddenLayers[0],
        activation: 'relu',
        inputShape: [inputShape],
      }),
    );

    // 隐藏层
    for (let i = 1; i < this.config.modelArchitecture.hiddenLayers.length; i++) {
      model.add(tf.layers.dropout({ rate: this.config.modelArchitecture.dropout }));
      model.add(
        tf.layers.dense({
          units: this.config.modelArchitecture.hiddenLayers[i],
          activation: 'relu',
        }),
      );
    }

    // 输出层
    model.add(
      tf.layers.dense({
        units: 5, // 总分 + 4个类别分数(睡眠、活动、营养、压力)
        activation: 'sigmoid',
      }),
    );

    // 编译模型
    model.compile({
      optimizer: tf.train.adam(this.config.learningRate),
      loss: 'meanSquaredError',
      metrics: ['accuracy'],
    });

    return model;
  }

  /**
   * 准备训练数据
   */
  private async prepareData(data: IHealthData[]): Promise<{
    trainFeatures: tf.Tensor2D;
    trainLabels: tf.Tensor2D;
  }> {
    try {
      const processedData = await Promise.all(
        data.map(d => this.dataProcessor.processHealthData(d)),
      );

      const features = processedData.map(d => d.features.flat());
      const labels = this.generateLabels(data);

      return {
        trainFeatures: tf.tensor2d(features),
        trainLabels: tf.tensor2d(labels),
      };
    } catch (error) {
      logger.error('准备训练数据失败', error);
      throw error;
    }
  }

  /**
   * 生成标签
   */
  private generateLabels(data: IHealthData[]): number[][] {
    return data.map(d => {
      // 计算各项评分
      const sleepScore = this.calculateSleepScore(d.lifestyleData);
      const activityScore = this.calculateActivityScore(d.lifestyleData);
      const nutritionScore = this.calculateNutritionScore(d.nutritionData);
      const stressScore = this.calculateStressScore(d.mentalData);

      // 计算总分
      const overallScore = (sleepScore + activityScore + nutritionScore + stressScore) / 4;

      return [overallScore, sleepScore, activityScore, nutritionScore, stressScore];
    });
  }

  /**
   * 计算睡眠评分
   */
  private calculateSleepScore(lifestyle: IHealthData['lifestyleData']): number {
    const sleepHoursScore = this.normalizeInRange(lifestyle.sleepHours, 7, 9);
    return sleepHoursScore;
  }

  /**
   * 计算活动评分
   */
  private calculateActivityScore(lifestyle: IHealthData['lifestyleData']): number {
    const activityLevelScore = lifestyle.activityLevel / 10;

    // 计算每日活动时长得分
    const totalDuration = lifestyle.activities.reduce(
      (sum, activity) => sum + activity.duration,
      0,
    );
    const durationScore = this.normalizeInRange(totalDuration, 30, 60);

    // 计算活动强度得分
    const avgIntensity =
      lifestyle.activities.reduce((sum, activity) => sum + activity.intensity, 0) /
        lifestyle.activities.length || 0;
    const intensityScore = avgIntensity / 10;

    return (activityLevelScore + durationScore + intensityScore) / 3;
  }

  /**
   * 计算营养评分
   */
  private calculateNutritionScore(nutrition: IHealthData['nutritionData']): number {
    // 计算卡路里摄入得分
    const calorieScore = this.normalizeInRange(nutrition.calorieIntake, 1500, 2500);

    // 计算水分摄入得分
    const waterScore = this.normalizeInRange(nutrition.waterIntake, 2000, 3000);

    // 计算餐食规律性得分
    const mealRegularityScore = this.calculateMealRegularity(nutrition.meals);

    return (calorieScore + waterScore + mealRegularityScore) / 3;
  }

  /**
   * 计算餐食规律性评分
   */
  private calculateMealRegularity(meals: IHealthData['nutritionData']['meals']): number {
    // 检查三餐是否规律
    const mealTypes = new Set(meals.map(m => m.type));
    const hasAllMeals = ['breakfast', 'lunch', 'dinner'].every(type => mealTypes.has(type as any));

    // 检查进餐时间间隔
    const mealTimes = meals.filter(m => m.type !== 'snack').map(m => new Date(m.time).getHours());
    const hasProperIntervals = this.checkMealIntervals(mealTimes);

    return hasAllMeals && hasProperIntervals ? 1 : 0.5;
  }

  /**
   * 检查进餐时间间隔
   */
  private checkMealIntervals(mealTimes: number[]): boolean {
    if (mealTimes.length < 2) return false;

    mealTimes.sort((a, b) => a - b);
    for (let i = 1; i < mealTimes.length; i++) {
      const interval = mealTimes[i] - mealTimes[i - 1];
      if (interval < 3 || interval > 6) return false;
    }

    return true;
  }

  /**
   * 计算压力评分
   */
  private calculateStressScore(mental: IHealthData['mentalData']): number {
    // 压力水平得分(反向计算,压力越低分数越高)
    const stressScore = 1 - mental.stressLevel / 10;

    // 情绪得分
    const moodScore = mental.moodScore / 10;

    // 睡眠质量得分
    const sleepQualityScore = mental.sleepQuality / 10;

    return (stressScore + moodScore + sleepQualityScore) / 3;
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
  async train(data: IHealthData[]): Promise<tf.History> {
    try {
      logger.info('开始训练模型', {
        dataSize: data.length,
        config: this.config,
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
          },
        },
      });

      logger.info('模型训练完成', {
        finalLoss: history.history.loss[history.history.loss.length - 1],
        finalAccuracy: history.history.acc[history.history.acc.length - 1],
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
        throw new Error('���型未训练');
      }

      const saveResult = await this.model.save('file://./models/lifestyle');
      logger.info('模型保存成功', { saveResult });
    } catch (error) {
      logger.error('模型保存失败', error);
      throw error;
    }
  }

  /**
   * 评估模型
   */
  async evaluate(testData: IHealthData[]): Promise<{
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
        accuracy: (result as tf.Scalar[])[1].dataSync()[0],
      };
    } catch (error) {
      logger.error('模型评估失败', error);
      throw error;
    }
  }
}
