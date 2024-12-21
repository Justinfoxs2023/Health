import { INutritionPlan, IMealRecord, INutritionAnalysis } from '../../types/nutrition';
import { Logger } from '../../utils/logger';
import { UserProfile } from '../../types/user';

export class NutritionService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('NutritionService');
  }

  // 生成营养计划
  async generateNutritionPlan(userProfile: UserProfile, preferences: any): Promise<INutritionPlan> {
    try {
      // 1. 计算需求
      const requirements = await this.calculateNutritionRequirements(userProfile);

      // 2. 考虑偏好
      const adjustedRequirements = this.adjustForPreferences(requirements, preferences);

      // 3. 生成膳食方案
      const meals = await this.planMeals(adjustedRequirements);

      // 4. 添加建议
      return {
        requirements: adjustedRequirements,
        meals,
        recommendations: await this.generateRecommendations(meals),
      };
    } catch (error) {
      this.logger.error('生成营养计划失败', error);
      throw error;
    }
  }

  // 记录饮食
  async recordMeal(userId: string, meal: IMealRecord): Promise<void> {
    try {
      // 1. 验证记录
      await this.validateMealRecord(meal);

      // 2. 计算营养
      const nutrition = await this.calculateNutrition(meal);

      // 3. 更新记录
      await this.updateMealRecord(userId, {
        ...meal,
        nutrition,
      });

      // 4. 更新统计
      await this.updateNutritionStats(userId);
    } catch (error) {
      this.logger.error('记录饮食失败', error);
      throw error;
    }
  }

  // 分析营养状况
  async analyzeNutrition(
    userId: string,
    timeRange: { start: Date; end: Date },
  ): Promise<INutritionAnalysis> {
    try {
      // 1. 获取数据
      const data = await this.getNutritionData(userId, timeRange);

      // 2. 分析摄入
      const intake = await this.analyzeNutrientIntake(data);

      // 3. 识别模式
      const patterns = await this.identifyEatingPatterns(data);

      // 4. 评估平衡
      return {
        intake,
        patterns,
        balance: await this.evaluateNutritionBalance(intake),
        recommendations: await this.generateRecommendations(intake, patterns),
      };
    } catch (error) {
      this.logger.error('分析营养状况失败', error);
      throw error;
    }
  }

  // 调整营养计划
  async adjustNutritionPlan(userId: string, feedback: any): Promise<INutritionPlan> {
    try {
      // 1. 获取当前计划
      const currentPlan = await this.getCurrentPlan(userId);

      // 2. 分析反馈
      const adjustments = await this.analyzeFeedback(feedback);

      // 3. 应用调整
      const adjustedPlan = await this.applyAdjustments(currentPlan, adjustments);

      // 4. 验证新计划
      return await this.validateAndSavePlan(userId, adjustedPlan);
    } catch (error) {
      this.logger.error('调整营养计划失败', error);
      throw error;
    }
  }
}
