import { Logger } from '@/utils/Logger';
import { AIError } from '@/utils/errors';
import * as tf from '@tensorflow/tfjs-node';
import { FoodInfo, NutritionInfo } from '../models/FoodTypes';
import { AIModelService } from './AIModelService';
import { NutritionService } from '../health/NutritionService';

export class FoodRecognitionService {
  private logger: Logger;
  private model: AIModelService;
  private nutritionService: NutritionService;
  private readonly modelPath = 'models/food-recognition-v1';
  private readonly confidenceThreshold = 0.8;

  constructor() {
    this.logger = new Logger('FoodRecognition');
    this.model = new AIModelService();
    this.nutritionService = new NutritionService();
  }

  /**
   * 识别食物
   * @param image 图片数据
   */
  async recognizeFood(image: Buffer): Promise<FoodInfo> {
    try {
      // 1. 图像预处理
      const processedImage = await this.preprocessImage(image);

      // 2. 加载模型
      const model = await this.model.loadModel(this.modelPath);

      // 3. 执行识别
      const predictions = await model.predict(processedImage);

      // 4. 处理��别结果
      const recognitionResult = await this.processRecognitionResult(predictions);

      // 5. 获取营养信息
      const nutritionInfo = await this.getNutritionInfo(recognitionResult.foodName);

      return {
        ...recognitionResult,
        nutrition: nutritionInfo,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error('食物识别失败', error);
      throw new AIError('FOOD_RECOGNITION_FAILED', error.message);
    }
  }

  /**
   * 批量识别食物
   */
  async recognizeFoodBatch(images: Buffer[]): Promise<FoodInfo[]> {
    try {
      const recognitionPromises = images.map(image => this.recognizeFood(image));
      return await Promise.all(recognitionPromises);
    } catch (error) {
      this.logger.error('批量食物识别失败', error);
      throw new AIError('BATCH_RECOGNITION_FAILED', error.message);
    }
  }

  /**
   * 图像预处理
   */
  private async preprocessImage(image: Buffer): Promise<tf.Tensor> {
    try {
      // 1. 解码图像
      const decoded = tf.node.decodeImage(image);

      // 2. 调整大小
      const resized = tf.image.resizeBilinear(decoded, [224, 224]);

      // 3. 归一化
      const normalized = resized.div(255.0);

      // 4. 扩展维度
      return normalized.expandDims(0);
    } catch (error) {
      throw new AIError('IMAGE_PREPROCESSING_FAILED', error.message);
    }
  }

  /**
   * 处理识别结果
   */
  private async processRecognitionResult(predictions: tf.Tensor): Promise<any> {
    const [topIndex, confidence] = await this.getTopPrediction(predictions);

    if (confidence < this.confidenceThreshold) {
      throw new AIError('LOW_CONFIDENCE', '识别置信度过低');
    }

    return {
      foodName: await this.getFoodName(topIndex),
      confidence,
      category: await this.getFoodCategory(topIndex)
    };
  }

  /**
   * 获取营养信息
   */
  private async getNutritionInfo(foodName: string): Promise<NutritionInfo> {
    return await this.nutritionService.getNutritionInfo(foodName);
  }
} 