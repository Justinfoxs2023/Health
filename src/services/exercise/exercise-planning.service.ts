import { Injectable } from '@nestjs/common';
import { ExerciseTrackingService } from './exercise-tracking.service';
import { HealthMonitoringService } from '../health/health-monitoring.service';
import { AIService } from '../ai/ai.service';

export interface ExercisePlan {
  id: string;
  userId: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'rehabilitation';
  goal: {
    primary: string;
    secondary?: string[];
    targetMetrics: {
      duration?: number;
      frequency?: number;
      intensity?: string;
      specificGoals?: Record<string, number>;
    };
  };
  schedule: ExerciseSchedule[];
  progression: {
    phases: ExercisePhase[];
    currentPhase: number;
    adaptationRules: AdaptationRule[];
  };
}

@Injectable()
export class ExercisePlanningService {
  constructor(
    private readonly tracking: ExerciseTrackingService,
    private readonly health: HealthMonitoringService,
    private readonly ai: AIService
  ) {}

  // 创建个性化运动计划
  async createPlan(userId: string, params: {
    goal: string;
    preferences: string[];
    constraints: string[];
    timeAvailable: number;
  }): Promise<ExercisePlan> {
    // 1. 获取用户健康状况
    const healthProfile = await this.health.getProfile(userId);
    
    // 2. 分析运动能力
    const fitnessLevel = await this.assessFitnessLevel(userId);
    
    // 3. AI生成计划
    const plan = await this.ai.generateExercisePlan({
      healthProfile,
      fitnessLevel,
      ...params
    });

    // 4. 验证和调整计划
    await this.validatePlan(plan, healthProfile);
    
    return plan;
  }

  // 更新运动计划
  async updatePlan(planId: string, progress: ExerciseProgress): Promise<void> {
    const plan = await this.getPlan(planId);
    
    // 1. 评估进展
    const evaluation = await this.evaluateProgress(plan, progress);
    
    // 2. 调整计划
    if (evaluation.requiresAdjustment) {
      await this.adjustPlan(plan, evaluation);
    }
    
    // 3. 更新进度
    await this.updateProgress(plan, progress);
  }

  // 生成每日运动建议
  async getDailyRecommendation(userId: string): Promise<ExerciseRecommendation> {
    // 1. 获取计划
    const plan = await this.getCurrentPlan(userId);
    
    // 2. 检查健康状态
    const healthStatus = await this.health.getDailyStatus(userId);
    
    // 3. 考虑外部因素
    const context = await this.getExerciseContext(userId);
    
    // 4. 生成建议
    return this.generateDailyPlan(plan, healthStatus, context);
  }

  // 智能调整计划
  private async adjustPlan(
    plan: ExercisePlan,
    evaluation: PlanEvaluation
  ): Promise<void> {
    // 1. 分析调整需求
    const adjustmentNeeds = await this.analyzeAdjustmentNeeds(evaluation);
    
    // 2. 生成调整方案
    const adjustments = await this.generateAdjustments(plan, adjustmentNeeds);
    
    // 3. 应用调整
    await this.applyAdjustments(plan, adjustments);
    
    // 4. 记录调整历史
    await this.recordAdjustmentHistory(plan.id, adjustments);
  }

  // 评估运动进展
  private async evaluateProgress(
    plan: ExercisePlan,
    progress: ExerciseProgress
  ): Promise<PlanEvaluation> {
    return {
      achievementRate: this.calculateAchievementRate(plan, progress),
      strengthProgress: await this.evaluateStrengthProgress(progress),
      enduranceProgress: await this.evaluateEnduranceProgress(progress),
      technicalProgress: await this.evaluateTechnicalProgress(progress),
      requiresAdjustment: false, // 根据评估结果设置
      adjustmentSuggestions: []
    };
  }

  // 生成每日计划
  private async generateDailyPlan(
    plan: ExercisePlan,
    healthStatus: any,
    context: any
  ): Promise<ExerciseRecommendation> {
    // 1. 获取计划内容
    const scheduledExercises = this.getScheduledExercises(plan);
    
    // 2. 考虑健康状况
    const adjustedExercises = this.adjustForHealth(scheduledExercises, healthStatus);
    
    // 3. 考虑环境因素
    const contextAdjustedExercises = this.adjustForContext(adjustedExercises, context);
    
    // 4. 生成具体建议
    return {
      exercises: contextAdjustedExercises,
      intensity: this.calculateRecommendedIntensity(healthStatus),
      duration: this.calculateRecommendedDuration(context),
      precautions: this.generatePrecautions(healthStatus),
      alternatives: this.generateAlternatives(contextAdjustedExercises)
    };
  }
} 