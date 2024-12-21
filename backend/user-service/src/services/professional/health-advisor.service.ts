import { BaseProfessionalService } from './base.professional.service';
import { IHealthPlan, ILifestyleRecord, IHealthGoal } from '../../types/health.types';
import { TYPES } from '../../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class HealthAdvisorService extends BaseProfessionalService {
  async createHealthPlan(advisorId: string, clientId: string, plan: IHealthPlan): Promise<void> {
    await this.validateProfessionalAccess(advisorId, 'advisor');
    await this.validateClientAccess(advisorId, clientId);

    // 创建健康计划
    const planKey = `health:${clientId}:plan`;
    await this.redis.hset(planKey, {
      ...plan,
      createdBy: advisorId,
      createdAt: new Date().toISOString(),
    });

    this.logger.info(`健康顾问 ${advisorId} 为客户 ${clientId} 创建健康计划`);
  }

  async reviewLifestyleHabits(
    advisorId: string,
    clientId: string,
    record: ILifestyleRecord,
  ): Promise<void> {
    await this.validateProfessionalAccess(advisorId, 'advisor');
    await this.validateClientAccess(advisorId, clientId);

    // 评估生活方式
    const analysis = this.analyzeLifestyle(record);
    await this.redis.lpush(
      `health:${clientId}:analysis`,
      JSON.stringify({
        record,
        analysis,
        analyzedBy: advisorId,
        analyzedAt: new Date().toISOString(),
      }),
    );
  }

  async updateHealthGoals(advisorId: string, clientId: string, goals: IHealthGoal): Promise<void> {
    await this.validateProfessionalAccess(advisorId, 'advisor');
    await this.validateClientAccess(advisorId, clientId);

    // 更新健康目标
    await this.redis.hset(`health:${clientId}:goals`, goals);
  }

  private analyzeLifestyle(record: ILifestyleRecord) {
    return {
      sleepQuality: this.analyzeSleep(record),
      stressLevel: this.analyzeStress(record),
      workLifeBalance: this.analyzeBalance(record),
      recommendations: this.generateLifestyleRecommendations(record),
    };
  }
}
