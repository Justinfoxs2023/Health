import { BaseProfessionalService } from './base.professional.service';
import { IDietPlan, IMealRecord, INutritionGoal } from '../../types/nutrition.types';
import { TYPES } from '../../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class NutritionistService extends BaseProfessionalService {
  async createDietPlan(nutritionistId: string, clientId: string, plan: IDietPlan): Promise<void> {
    await this.validateProfessionalAccess(nutritionistId, 'nutritionist');
    await this.validateClientAccess(nutritionistId, clientId);

    // 创建饮食计划
    const planKey = `diet:${clientId}:plan`;
    await this.redis.hset(planKey, {
      ...plan,
      createdBy: nutritionistId,
      createdAt: new Date().toISOString(),
    });

    this.logger.info(`营养师 ${nutritionistId} 为客户 ${clientId} 创建饮食计划`);
  }

  async reviewMealRecord(
    nutritionistId: string,
    clientId: string,
    record: IMealRecord,
  ): Promise<void> {
    await this.validateProfessionalAccess(nutritionistId, 'nutritionist');
    await this.validateClientAccess(nutritionistId, clientId);

    // 评估饮食记录
    const feedback = this.analyzeMealNutrition(record);
    await this.redis.lpush(
      `diet:${clientId}:feedback`,
      JSON.stringify({
        record,
        feedback,
        reviewedBy: nutritionistId,
        reviewedAt: new Date().toISOString(),
      }),
    );
  }

  async updateNutritionGoals(
    nutritionistId: string,
    clientId: string,
    goals: INutritionGoal,
  ): Promise<void> {
    await this.validateProfessionalAccess(nutritionistId, 'nutritionist');
    await this.validateClientAccess(nutritionistId, clientId);

    // 更新营养目标
    await this.redis.hset(`diet:${clientId}:goals`, goals);
  }

  private analyzeMealNutrition(record: IMealRecord) {
    // 实现营养分析逻辑
    return {
      caloriesAnalysis: this.analyzeCalories(record),
      nutrientBalance: this.analyzeNutrients(record),
      suggestions: this.generateSuggestions(record),
    };
  }
}
