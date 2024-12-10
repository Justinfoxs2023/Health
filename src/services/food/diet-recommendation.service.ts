import { Logger } from '../../utils/logger';
import { OpenAI } from 'openai';
import { Food, NutritionInfo } from '../../types/food';
import { UserProfile } from '../../types/user';

export class DietRecommendationService {
  private logger: Logger;
  private openai: OpenAI;

  constructor() {
    this.logger = new Logger('DietRecommendation');
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // 生成饮食计划
  async generateDietPlan(
    userProfile: UserProfile,
    preferences: any
  ): Promise<DietPlan> {
    try {
      // 1. 分析用户需求
      const requirements = await this.analyzeRequirements(userProfile);
      
      // 2. 考虑饮食偏好
      const adjustedRequirements = this.adjustForPreferences(
        requirements,
        preferences
      );
      
      // 3. 生成膳食方案
      const meals = await this.planMeals(adjustedRequirements);
      
      // 4. 添加营养建议
      return {
        meals,
        nutritionGoals: requirements.goals,
        recommendations: await this.generateRecommendations(meals)
      };
    } catch (error) {
      this.logger.error('生成饮食计划失败', error);
      throw error;
    }
  }

  // 分析饮食习惯
  async analyzeDietaryHabits(
    mealRecords: MealRecord[]
  ): Promise<DietaryAnalysis> {
    try {
      // 1. 分析营养摄入
      const nutritionAnalysis = await this.analyzeNutritionIntake(mealRecords);
      
      // 2. 识别饮食模式
      const patterns = await this.identifyDietaryPatterns(mealRecords);
      
      // 3. 评估健康风险
      const risks = await this.assessHealthRisks(nutritionAnalysis, patterns);
      
      // 4. 生成改进建议
      return {
        analysis: nutritionAnalysis,
        patterns,
        risks,
        recommendations: await this.generateImprovements(risks)
      };
    } catch (error) {
      this.logger.error('分析饮食习惯失败', error);
      throw error;
    }
  }
} 