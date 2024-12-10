import { Logger } from '../../utils/logger';
import { OpenAI } from 'openai';
import { Food, FoodAnalysis } from '../../types/food';
import { ImageProcessor } from '../../utils/image-processor';

export class FoodRecognitionService {
  private logger: Logger;
  private openai: OpenAI;
  private imageProcessor: ImageProcessor;

  constructor() {
    this.logger = new Logger('FoodRecognition');
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.imageProcessor = new ImageProcessor();
  }

  // 识别食品图片
  async recognizeFood(imageData: Buffer): Promise<Food[]> {
    try {
      // 1. 预处理图片
      const processedImage = await this.imageProcessor.preprocess(imageData);
      
      // 2. 执行识别
      const recognition = await this.performRecognition(processedImage);
      
      // 3. 查找食品数据库
      const foods = await this.lookupFoodDatabase(recognition);
      
      // 4. 计算置信度
      return this.rankResults(foods, recognition);
    } catch (error) {
      this.logger.error('食品识别失败', error);
      throw error;
    }
  }

  // 分析营养成分
  async analyzeNutrition(food: Food, portion: number): Promise<FoodAnalysis> {
    try {
      // 1. 计算营养值
      const nutrition = this.calculateNutrition(food, portion);
      
      // 2. 评估营养平衡
      const balance = await this.evaluateNutritionBalance(nutrition);
      
      // 3. 生成建议
      const recommendations = await this.generateRecommendations(balance);
      
      // 4. 查找替代品
      const alternatives = await this.findAlternatives(food, balance);
      
      return {
        food,
        mealContext: this.determineMealContext(),
        nutritionBalance: balance,
        healthImpact: await this.assessHealthImpact(nutrition),
        alternatives
      };
    } catch (error) {
      this.logger.error('营养分析失败', error);
      throw error;
    }
  }
} 