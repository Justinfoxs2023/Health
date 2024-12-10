import { Logger } from '../../shared/utils/logger';
import { VitalSignsModelTrainer } from './train-vital-signs';
import { LifestyleModelTrainer } from './train-lifestyle';
import { 
  vitalSignsConfig, 
  lifestyleConfig,
  dataConfig,
  evaluationConfig
} from '../config/training-config';
import { HealthData } from '../../shared/types/health.types';

const logger = new Logger('ModelTraining');

/**
 * 训练所有模型
 */
export async function trainAllModels(trainingData: HealthData[]): Promise<void> {
  try {
    logger.info('开始训练所有模型', { 
      dataSize: trainingData.length,
      dataConfig,
      evaluationConfig
    });

    // 数据预处理
    const { trainData, testData } = splitData(trainingData);

    // 训练生命体征模型
    await trainVitalSignsModel(trainData, testData);

    // 训练生活方式模型
    await trainLifestyleModel(trainData, testData);

    logger.info('所有模型训练完成');
  } catch (error) {
    logger.error('模型训练失败', error);
    throw error;
  }
}

/**
 * 训练生命体征模型
 */
async function trainVitalSignsModel(
  trainData: HealthData[],
  testData: HealthData[]
): Promise<void> {
  try {
    logger.info('开始训练生命体征模型');

    const trainer = new VitalSignsModelTrainer(vitalSignsConfig);
    
    // 训练模型
    const history = await trainer.train(trainData);
    
    // 评估模型
    const evaluation = await trainer.evaluate(testData);

    // 检查模型性能
    if (!checkModelPerformance(evaluation)) {
      throw new Error('生命体征模型性能未达标');
    }

    logger.info('生命体征模型训练完成', { history, evaluation });
  } catch (error) {
    logger.error('生命体征模型训练失败', error);
    throw error;
  }
}

/**
 * 训练生活方式模型
 */
async function trainLifestyleModel(
  trainData: HealthData[],
  testData: HealthData[]
): Promise<void> {
  try {
    logger.info('开始训练生活方式模型');

    const trainer = new LifestyleModelTrainer(lifestyleConfig);
    
    // 训练模型
    const history = await trainer.train(trainData);
    
    // 评估模型
    const evaluation = await trainer.evaluate(testData);

    // 检查模型性能
    if (!checkModelPerformance(evaluation)) {
      throw new Error('生活方式模型性能未达标');
    }

    logger.info('生活方式模型训练完成', { history, evaluation });
  } catch (error) {
    logger.error('生活方式模型训练失败', error);
    throw error;
  }
}

/**
 * 划分训练集和测试集
 */
function splitData(data: HealthData[]): {
  trainData: HealthData[];
  testData: HealthData[];
} {
  // 随机打乱数据
  if (dataConfig.shuffle) {
    data = shuffleArray([...data]);
  }

  const splitIndex = Math.floor(data.length * dataConfig.trainTestSplit);
  return {
    trainData: data.slice(0, splitIndex),
    testData: data.slice(splitIndex)
  };
}

/**
 * 随机打乱数组
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * 检查模型性能
 */
function checkModelPerformance(evaluation: {
  loss: number;
  accuracy: number;
}): boolean {
  return (
    evaluation.accuracy >= evaluationConfig.thresholds.accuracy &&
    evaluation.loss <= evaluationConfig.thresholds.loss
  );
} 