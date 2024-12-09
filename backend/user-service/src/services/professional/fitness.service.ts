import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { BaseProfessionalService } from './base.professional.service';
import { WorkoutPlan, ExerciseRecord, FitnessGoal } from '../../types/fitness.types';

@injectable()
export class FitnessService extends BaseProfessionalService {
  async createWorkoutPlan(trainerId: string, clientId: string, plan: WorkoutPlan): Promise<void> {
    await this.validateProfessionalAccess(trainerId, 'trainer');
    await this.validateClientAccess(trainerId, clientId);

    // 创建训练计划
    const planKey = `workout:${clientId}:plan`;
    await this.redis.hset(planKey, {
      ...plan,
      createdBy: trainerId,
      createdAt: new Date().toISOString()
    });

    this.logger.info(`教练 ${trainerId} 为客户 ${clientId} 创建训练计划`);
  }

  async reviewExerciseForm(trainerId: string, clientId: string, record: ExerciseRecord): Promise<void> {
    await this.validateProfessionalAccess(trainerId, 'trainer');
    await this.validateClientAccess(trainerId, clientId);

    // 评估运动姿势和表现
    const feedback = this.analyzeExerciseForm(record);
    await this.redis.lpush(`workout:${clientId}:feedback`, JSON.stringify({
      record,
      feedback,
      reviewedBy: trainerId,
      reviewedAt: new Date().toISOString()
    }));
  }

  async updateFitnessGoals(trainerId: string, clientId: string, goals: FitnessGoal): Promise<void> {
    await this.validateProfessionalAccess(trainerId, 'trainer');
    await this.validateClientAccess(trainerId, clientId);

    // 更新健身目标
    await this.redis.hset(`fitness:${clientId}:goals`, goals);
  }

  private analyzeExerciseForm(record: ExerciseRecord) {
    return {
      formAnalysis: this.analyzeForm(record),
      performanceMetrics: this.analyzePerformance(record),
      recommendations: this.generateRecommendations(record)
    };
  }
} 