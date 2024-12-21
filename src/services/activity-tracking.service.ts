import { ACTIVITY_CONFIG, REWARD_CONFIG } from '../config/interface.config';
import { Injectable } from '@nestjs/common';
import { QuestTrackingService } from './quest-tracking.service';
import { RewardService } from './reward.service';

@Injectable()
export class ActivityTrackingService {
  constructor(
    private readonly questTrackingService: QuestTrackingService,
    private readonly rewardService: RewardService,
  ) {}

  async trackDailyActivity(userId: string, activityType: string): Promise<void> {
    try {
      // 更新活跃度
      const points = ACTIVITY_CONFIG.dailyTasks[activityType];
      if (points) {
        await this.updateActivityPoints(userId, points);
      }

      // 检查每日任务完成情况
      const dailyProgress = await this.checkDailyTasksProgress(userId);
      if (dailyProgress.isCompleted) {
        await this.grantDailyRewards(userId);
      }

      // 更新任务进度
      await this.questTrackingService.trackQuestProgress(userId, 'daily_activity', activityType, 1);
    } catch (error) {
      console.error('Error in activity-tracking.service.ts:', '更新活跃度失败:', error);
      throw error;
    }
  }

  private async updateActivityPoints(userId: string, points: number): Promise<void> {
    // 更新用户活跃度积分
    await this.rewardService.grantPoints(userId, points);
  }

  private async checkDailyTasksProgress(userId: string): Promise<any> {
    // 检查每日任务完成进度
    // 返回进度信息
  }

  private async grantDailyRewards(userId: string): Promise<void> {
    const rewards = REWARD_CONFIG.activityRewards.daily;
    await this.rewardService.grantRewards(userId, rewards);
  }
}
