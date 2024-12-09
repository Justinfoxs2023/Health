import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { BaseProfessionalService } from './base.professional.service';
import { HealthPlan, LifestyleRecord, HealthGoal } from '../../types/health.types';

@injectable()
export class HealthAdvisorService extends BaseProfessionalService {
  async createHealthPlan(advisorId: string, clientId: string, plan: HealthPlan): Promise<void> {
    await this.validateProfessionalAccess(advisorId, 'advisor');
    await this.validateClientAccess(advisorId, clientId);

    // 创建健康计划
    const planKey = `health:${clientId}:plan`;
    await this.redis.hset(planKey, {
      ...plan,
      createdBy: advisorId,
      createdAt: new Date().toISOString()
    });

    this.logger.info(`健康顾问 ${advisorId} 为客户 ${clientId} 创建健康计划`);
  }

  async reviewLifestyleHabits(advisorId: string, clientId: string, record: LifestyleRecord): Promise<void> {
    await this.validateProfessionalAccess(advisorId, 'advisor');
    await this.validateClientAccess(advisorId, clientId);

    // 评估生活方式
    const analysis = this.analyzeLifestyle(record);
    await this.redis.lpush(`health:${clientId}:analysis`, JSON.stringify({
      record,
      analysis,
      analyzedBy: advisorId,
      analyzedAt: new Date().toISOString()
    }));
  }

  async updateHealthGoals(advisorId: string, clientId: string, goals: HealthGoal): Promise<void> {
    await this.validateProfessionalAccess(advisorId, 'advisor');
    await this.validateClientAccess(advisorId, clientId);

    // 更新健康目标
    await this.redis.hset(`health:${clientId}:goals`, goals);
  }

  private analyzeLifestyle(record: LifestyleRecord) {
    return {
      sleepQuality: this.analyzeSleep(record),
      stressLevel: this.analyzeStress(record),
      workLifeBalance: this.analyzeBalance(record),
      recommendations: this.generateLifestyleRecommendations(record)
    };
  }
} 