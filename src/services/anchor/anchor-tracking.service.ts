import { IContentAnchor, IRewardRule, IRewardRecord } from '../../types/anchor';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnchorTrackingService {
  constructor(
    private readonly rewardService: RewardService,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {}

  // 记录锚点点击
  async trackAnchorClick(anchorId: string, userId: string): Promise<IRewardRecord> {
    const anchor = await this.findAnchor(anchorId);
    const rule = await this.getRewardRule('click');

    // 更新点击统计
    await this.updateAnchorStats(anchorId, { clicks: anchor.clicks + 1 });

    // 计算并发放奖励
    const reward = await this.rewardService.issueReward({
      userId,
      anchorId,
      type: 'click',
      points: rule.points,
      commission: 0, // 点击暂无佣金
    });

    return reward;
  }

  // 追踪订单转化
  async trackConversion(orderId: string, anchorId: string): Promise<IRewardRecord> {
    const [anchor, order, rule] = await Promise.all([
      this.findAnchor(anchorId),
      this.orderService.findById(orderId),
      this.getRewardRule('conversion'),
    ]);

    // 计算佣金
    const commission = this.calculateCommission(order.total, rule.commission);

    // 更新转化统计
    await this.updateAnchorStats(anchorId, {
      conversions: anchor.conversions + 1,
      revenue: anchor.revenue + order.total,
    });

    // 发放奖励
    const reward = await this.rewardService.issueReward({
      userId: anchor.userId,
      anchorId,
      type: 'conversion',
      points: rule.points,
      commission,
      orderId,
    });

    return reward;
  }

  private calculateCommission(orderTotal: number, rule: IRewardRule['commission']): number {
    const commission = orderTotal * rule.rate;
    return Math.min(Math.max(commission, rule.minimum), rule.maximum);
  }

  // 获取锚点统计
  async getAnchorStats(
    userId: string,
    timeRange?: { start: Date; end: Date },
  ): Promise<AnchorStats> {
    const anchors = await this.findUserAnchors(userId, timeRange);

    return {
      totalClicks: anchors.reduce((sum, a) => sum + a.clicks, 0),
      totalConversions: anchors.reduce((sum, a) => sum + a.conversions, 0),
      totalRevenue: anchors.reduce((sum, a) => sum + a.revenue, 0),
      totalCommission: await this.calculateTotalCommission(userId, timeRange),
      topAnchors: this.rankAnchors(anchors).slice(0, 5),
    };
  }
}
