import { Logger } from '../../utils/logger';
import { NutritionInfo, Food } from '../../types/food';
import { UserProfile } from '../../types/user';

export class NutritionAnalysisService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('NutritionAnalysis');
  }

  // 分析营养平衡
  async analyzeNutritionBalance(
    intake: NutritionInfo,
    userProfile: UserProfile
  ): Promise<NutritionBalance> {
    try {
      // 1. 计算需求
      const requirements = this.calculateRequirements(userProfile);
      
      // 2. 比较摄入
      const comparison = this.compareWithRequirements(intake, requirements);
      
      // 3. 评分营养
      const scores = this.scoreNutrition(comparison);
      
      // 4. 生成建议
      return {
        scores,
        deficiencies: this.identifyDeficiencies(comparison),
        excesses: this.identifyExcesses(comparison),
        recommendations: await this.generateRecommendations(comparison)
      };
    } catch (error) {
      this.logger.error('营养平衡分析失败', error);
      throw error;
    }
  }

  // 计算营养摄��
  async calculateNutritionIntake(
    foods: Food[],
    portions: number[]
  ): Promise<NutritionInfo> {
    try {
      return foods.reduce((total, food, index) => {
        const portion = portions[index];
        return this.addNutrition(total, this.scaleNutrition(food.nutrition, portion));
      }, this.createEmptyNutrition());
    } catch (error) {
      this.logger.error('营养摄入计算失败', error);
      throw error;
    }
  }
} 