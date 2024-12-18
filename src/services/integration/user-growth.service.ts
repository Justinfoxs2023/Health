import { AchievementService } from '../achievement/achievement.service';
import { IGrowthActivity, IGrowthMetrics } from '../../types/growth.types';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../common/logger.service';
import { PrismaService } from '../common/prisma.service';
import { PromotionService } from '../promotion/promotion.service';

@Injectable()
export class UserGrowthService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private achievement: AchievementService,
    private promotion: PromotionService,
  ) {}

  async recordActivity(
    userId: string,
    activity: Omit<IGrowthActivity, 'timestamp'>,
  ): Promise<void> {
    try {
      await this.prisma.userActivity.create({
        data: {
          userId,
          type: activity.type,
          points: activity.points,
          metadata: activity.metadata,
        },
      });

      const totalPoints = await this.calculateGrowthPoints(userId);

      // 检查成就和晋升
      await Promise.all([
        this.achievement.checkAchievements(userId, totalPoints),
        this.promotion.checkPromotion(userId, totalPoints),
      ]);
    } catch (error) {
      this.logger.error('记录活动失败', error.stack);
      throw error;
    }
  }

  async getGrowthMetrics(userId: string): Promise<IGrowthMetrics> {
    try {
      const [activities, achievements, currentLevel] = await Promise.all([
        this.prisma.userActivity.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        this.prisma.achievement.findMany({
          where: { userId },
        }),
        this.prisma.userLevel.findFirst({
          where: { userId },
          orderBy: { achievedAt: 'desc' },
        }),
      ]);

      const totalPoints = activities.reduce((sum, act) => sum + act.points, 0);
      const level = currentLevel?.level || 0;
      const nextLevelPoints = this.calculateNextLevelPoints(level);

      // 转换 UserActivity 到 GrowthActivity
      const recentActivities: IGrowthActivity[] = activities.map(activity => ({
        type: activity.type,
        points: activity.points,
        timestamp: activity.createdAt,
        metadata: activity.metadata,
      }));

      return {
        totalPoints,
        currentLevel: level,
        nextLevelPoints,
        achievements,
        recentActivities,
      };
    } catch (error) {
      this.logger.error('获取成长指标失败', error.stack);
      throw error;
    }
  }

  private calculateNextLevelPoints(currentLevel: number): number {
    const levelThresholds = [100, 300, 600, 1000, 2000];
    return levelThresholds[currentLevel] || Infinity;
  }

  private async calculateGrowthPoints(userId: string): Promise<number> {
    const activities = await this.prisma.userActivity.findMany({
      where: { userId },
    });
    return activities.reduce((sum, act) => sum + act.points, 0);
  }
}
