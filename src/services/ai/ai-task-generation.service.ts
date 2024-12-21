import {
  IUserHealthProfile,
  IAIGeneratedTask,
  ITaskAdjustmentSuggestion,
} from '../../types/gamification/ai-task.types';
import { IActivityRewardRule } from '../../types/gamification/activity.types';
import { Injectable, Logger } from '@nestjs/common';

@Inj
ectable()
export class AITaskGenerationService {
  private readonly logger = new Logger(AITaskGenerationService.name);

  // 生成个性化任务
  async generatePersonalizedTasks(
    userId: string,
    healthProfile: IUserHealthProfile,
  ): Promise<IAIGeneratedTask[]> {
    try {
      // 分析用户健康状况
      const healthAnalysis = await this.analyzeHealthProfile(healthProfile);

      // 生成基础任务
      const baseTasks = await this.createBaseTasks(healthAnalysis);

      // 根据个人情况调整任务难度和奖励
      const adjustedTasks = await this.adjustTasksForUser(baseTasks, healthProfile);

      // 添加支持功能和替代方案
      const enhancedTasks = await this.addSupportFeatures(adjustedTasks, healthProfile);

      return enhancedTasks;
    } catch (error) {
      this.logger.error('生成个性化任务失败', error);
      throw error;
    }
  }

  // 动态调整任务难度和奖励
  async adjustTaskDifficultyAndRewards(
    userId: string,
    taskId: string,
    progressData: any,
  ): Promise<ITaskAdjustmentSuggestion> {
    try {
      // 分析任务完成情况
      const performanceAnalysis = await this.analyzeTaskPerformance(userId, taskId, progressData);

      // 生成调整建议
      const adjustment = await this.generateAdjustmentSuggestion(performanceAnalysis);

      // 计算新的奖励倍数
      const newRewards = await this.calculateAdjustedRewards(adjustment);

      return {
        taskId,
        ...adjustment,
        suggestedChanges: {
          ...adjustment.suggestedChanges,
          rewards: newRewards,
        },
      };
    } catch (error) {
      this.logger.error('调整任务难度和奖励失败', error);
      throw error;
    }
  }

  // 生成健康管理方案
  async generateHealthManagementPlan(
    userId: string,
    healthProfile: IUserHealthProfile,
  ): Promise<any> {
    try {
      // 分析健康风险
      const riskAnalysis = await this.analyzeHealthRisks(healthProfile);

      // 生成个性化建议
      const recommendations = await this.generateRecommendations(riskAnalysis);

      // 创建阶段性目标
      const phaseGoals = await this.createPhaseGoals(recommendations);

      // 设计任务线
      const taskSequence = await this.designTaskSequence(phaseGoals);

      return {
        riskAnalysis,
        recommendations,
        phaseGoals,
        taskSequence,
      };
    } catch (error) {
      this.logger.error('生成健康管理方案失败', error);
      throw error;
    }
  }

  private async calculateAdjustedRewards(adjustment: ITaskAdjustmentSuggestion): Promise<any> {
    const baseMultiplier = 1.0;
    const difficultyBonus = adjustment.suggestedChanges.difficulty
      ? adjustment.suggestedChanges.difficulty * 0.1
      : 0;
    const personalizedBonus = adjustment.expectedImpact.successRate * 0.1;

    return {
      multiplier: baseMultiplier + difficultyBonus + personalizedBonus,
    };
  }
}
