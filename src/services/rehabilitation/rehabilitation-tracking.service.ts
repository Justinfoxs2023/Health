import { Injectable } from '@nestjs/common';
import { HealthBaseService } from '../health/base/health-base.service';
import { StorageService } from '../storage/storage.service';
import { AIService } from '../ai/ai.service';
import { ExerciseService } from '../exercise/exercise.service';
import { 
  HealthCondition, 
  RehabPlan, 
  ProgressEvaluation,
  RehabSession 
} from './types/rehabilitation.types';

@Injectable()
export class RehabilitationTrackingService extends HealthBaseService {
  constructor(
    storage: StorageService,
    ai: AIService,
    private readonly exercise: ExerciseService
  ) {
    super(storage, ai);
  }

  // 获取当前计划
  async getCurrentPlan(userId: string): Promise<RehabPlan> {
    const plan = await this.getData<RehabPlan>(`rehab_plan:${userId}`);
    if (!plan) {
      throw new Error('No active rehabilitation plan found');
    }
    return plan;
  }

  // 获取最近会话
  async getRecentSessions(planId: string): Promise<RehabSession[]> {
    return this.getListData<RehabSession>(`rehab_sessions:${planId}`);
  }

  // 保存会话
  async saveSession(session: Partial<RehabSession>): Promise<void> {
    const plan = await this.getCurrentPlan(session.userId);
    
    // 验证会话数据
    if (!this.validateSessionData(session, plan)) {
      throw new Error('Invalid session data');
    }
    
    const sessions = await this.getRecentSessions(session.planId);
    sessions.push({
      ...session,
      id: this.generateId(),
      timestamp: new Date(),
      source: 'user',
      reliability: 1,
      verified: true
    } as RehabSession);
    
    await this.saveData(`rehab_sessions:${session.planId}`, sessions);
  }

  // 更新进度
  async updateProgress(planId: string, session: Partial<RehabSession>): Promise<void> {
    const plan = await this.getData<RehabPlan>(`rehab_plan:${planId}`);
    if (!plan) return;

    // 更新进度指标
    await this.updateProgressMetrics(plan, session);
    
    // 保存更新后的计划
    await this.saveData(`rehab_plan:${planId}`, plan);
  }

  // 康复计划管理
  async manageRehabPlan(
    userId: string,
    condition: HealthCondition
  ): Promise<RehabPlan> {
    // 1. 评估状况
    const assessment = await this.assessCondition(userId, condition);
    
    // 2. 制定计划
    const plan = await this.createRehabPlan(assessment);
    
    // 3. 设置进度追踪
    await this.setupProgressTracking(userId, plan);
    
    return plan;
  }

  // 记录康复会话
  async recordSession(userId: string, session: Partial<RehabSession>): Promise<void> {
    const plan = await this.getCurrentPlan(userId);
    
    // 1. 验证会话
    await this.validateSession(session, plan);
    
    // 2. 保存会话记录
    await this.saveSession(session);
    
    // 3. 更新进度
    await this.updateProgress(plan.id, session);
    
    // 4. 检查是否需要调整计划
    await this.checkAndAdjustPlan(plan, session);
  }

  // 进度评估
  async evaluateProgress(userId: string): Promise<ProgressEvaluation> {
    // 1. 获取计划和会话数据
    const plan = await this.getCurrentPlan(userId);
    const sessions = await this.getRecentSessions(plan.id);
    
    // 2. 分析进展
    const analysis = await this.analyzeProgress(plan, sessions);
    
    // 3. 评估目标完成
    const achievements = await this.evaluateAchievements(plan, analysis);
    
    // 4. 生成建议
    const recommendations = await this.generateRecommendations(analysis);
    
    return {
      period: this.calculatePeriod(sessions),
      metrics: analysis.metrics,
      achievements,
      analysis: {
        improvements: analysis.improvements,
        challenges: analysis.challenges,
        recommendations
      },
      nextSteps: await this.planNextSteps(plan, analysis)
    };
  }

  // 私有辅助方法
  private async assessCondition(userId: string, condition: HealthCondition): Promise<any> {
    // 实现状况评估逻辑
    return null;
  }

  private async createRehabPlan(assessment: any): Promise<RehabPlan> {
    // 实现计划创建逻辑
    return null;
  }

  private async setupProgressTracking(userId: string, plan: RehabPlan): Promise<void> {
    // 实现进度追踪设置逻辑
  }

  private async validateSession(session: Partial<RehabSession>, plan: RehabPlan): Promise<void> {
    // 实现会话验证逻辑
  }

  private async analyzeProgress(plan: RehabPlan, sessions: RehabSession[]): Promise<any> {
    // 实现进展分析逻辑
    return null;
  }

  private async evaluateAchievements(plan: RehabPlan, analysis: any): Promise<any[]> {
    // 实现目标评估逻辑
    return [];
  }

  private async generateRecommendations(analysis: any): Promise<string[]> {
    // 实现建议生成逻辑
    return [];
  }

  private async planNextSteps(plan: RehabPlan, analysis: any): Promise<any> {
    // 实现下一步计划生成逻辑
    return null;
  }

  // 检查和调整计划
  private async checkAndAdjustPlan(plan: RehabPlan, session: Partial<RehabSession>): Promise<void> {
    // 分析会话数据
    const analysis = await this.analyzeSessionData(session);
    
    // 检查是否需要调整
    if (this.requiresAdjustment(analysis)) {
      // 生成调整建议
      const adjustments = await this.generateAdjustments(plan, analysis);
      
      // 应用调整
      await this.applyAdjustments(plan, adjustments);
    }
  }

  // 更新进度指标
  private async updateProgressMetrics(plan: RehabPlan, session: Partial<RehabSession>): Promise<void> {
    // 更新疼痛水平
    if (session.measurements?.painAfter !== undefined) {
      plan.progress.painLevel.push(session.measurements.painAfter);
    }

    // 更新活动能力
    if (session.measurements?.performance !== undefined) {
      plan.progress.function.push(session.measurements.performance);
    }

    // 更新其他指标...
  }

  // 生成唯一ID
  private generateId(): string {
    return `rehab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 