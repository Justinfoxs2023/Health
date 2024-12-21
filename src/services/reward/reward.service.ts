import { IRewardRule, IRewardRecord } from '../../types/anchor';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardService {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  // 发放奖励
  async issueReward(params: {
    userId: string;
    anchorId: string;
    type: 'click' | 'conversion';
    points: number;
    commission: number;
    orderId?: string;
  }): Promise<IRewardRecord> {
    const { userId, anchorId, type, points, commission, orderId } = params;

    // 创建奖励记录
    const reward = await this.createRewardRecord({
      userId,
      anchorId,
      type,
      points,
      commission,
      orderId,
      timestamp: new Date(),
    });

    // 更新用户积分和佣金
    await Promise.all([
      this.userService.updatePoints(userId, points),
      this.userService.updateCommission(userId, commission),
    ]);

    // 发送奖励通知
    await this.notificationService.sendRewardNotification(userId, {
      type,
      points,
      commission,
    });

    return reward;
  }

  // 获取奖励规则
  async getRewardRules(): Promise<IRewardRule[]> {
    return [
      {
        type: 'click',
        points: 1,
        commission: {
          rate: 0,
          minimum: 0,
          maximum: 0,
        },
      },
      {
        type: 'conversion',
        points: 10,
        commission: {
          rate: 0.05, // 5%分成
          minimum: 1, // 最低1元
          maximum: 100, // 最高100元
        },
      },
    ];
  }

  // 查询用户奖励记录
  async getUserRewards(
    userId: string,
    filters: {
      type?: 'click' | 'conversion';
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<IRewardRecord[]> {
    return this.findRewards({
      userId,
      ...filters,
    });
  }

  // 计算用户总收益
  async calculateTotalEarnings(
    userId: string,
    timeRange?: { start: Date; end: Date },
  ): Promise<{
    points: number;
    commission: number;
  }> {
    const rewards = await this.getUserRewards(userId, {
      startDate: timeRange?.start,
      endDate: timeRange?.end,
    });

    return rewards.reduce(
      (total, reward) => ({
        points: total.points + reward.points,
        commission: total.commission + reward.commission,
      }),
      { points: 0, commission: 0 },
    );
  }
}
