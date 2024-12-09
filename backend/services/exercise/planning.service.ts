import { EventEmitter } from 'events';
import { Logger } from '../../utils/logger';
import { AI } from '../../utils/ai';

interface ExercisePlan {
  id: string;
  userId: string;
  type: 'strength' | 'cardio' | 'flexibility';
  schedule: ExerciseSchedule[];
  goals: string[];
  restrictions: string[];
  progression: ProgressionPlan;
  createdAt: Date;
  updatedAt: Date;
}

export class ExercisePlanningService extends EventEmitter {
  private logger: Logger;
  private ai: AI;

  constructor() {
    super();
    this.logger = new Logger('ExercisePlanning');
    this.ai = new AI();
  }

  // 生成运动计划
  async generatePlan(userId: string, assessment: any): Promise<ExercisePlan> {
    try {
      // 1. 分析用户评估数据
      const analysis = await this.analyzeAssessment(assessment);
      
      // 2. 生成基础计划
      const basePlan = await this.createBasePlan(analysis);
      
      // 3. 个性化调整
      const personalizedPlan = await this.personalizePlan(basePlan, assessment);
      
      // 4. 添加进度追踪
      const finalPlan = await this.addProgressionPlan(personalizedPlan);

      // 5. 保存计划
      await this.savePlan(userId, finalPlan);

      return finalPlan;
    } catch (error) {
      this.logger.error('生成运动计划失败:', error);
      throw error;
    }
  }

  // 更新运动计划
  async updatePlan(planId: string, progress: any): Promise<ExercisePlan> {
    try {
      // 1. 获取当前计划
      const currentPlan = await this.getPlan(planId);
      
      // 2. 分析进度
      const progressAnalysis = await this.analyzeProgress(progress);
      
      // 3. 调整计划
      const updatedPlan = await this.adjustPlan(currentPlan, progressAnalysis);

      // 4. 保存更新
      await this.savePlan(currentPlan.userId, updatedPlan);

      return updatedPlan;
    } catch (error) {
      this.logger.error('更新运动计划失败:', error);
      throw error;
    }
  }

  // 生成训练建议
  async generateWorkoutSuggestions(plan: ExercisePlan): Promise<any> {
    try {
      const suggestions = await this.ai.analyze('workout', {
        plan,
        type: plan.type,
        goals: plan.goals,
        restrictions: plan.restrictions
      });

      return this.formatSuggestions(suggestions);
    } catch (error) {
      this.logger.error('生成训练建议失败:', error);
      throw error;
    }
  }
} 