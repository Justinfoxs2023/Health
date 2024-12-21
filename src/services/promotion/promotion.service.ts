import { Injectable } from '@nestjs/common';
import { LoggerService } from '../common/logger.service';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService, private logger: LoggerService) {}

  async checkPromotion(userId: string, points: number): Promise<void> {
    try {
      // 获取用户当前等级
      const currentLevel = await this.prisma.userLevel.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      // 检查是否达到升级条件
      const newLevel = this.calculateNewLevel(points, currentLevel?.level || 0);

      // 如果达到升级条件，创建新等级记录
      if (newLevel > (currentLevel?.level || 0)) {
        await this.prisma.userLevel.create({
          data: {
            userId,
            level: newLevel,
            achievedAt: new Date(),
          },
        });
      }
    } catch (error) {
      this.logger.error('检查晋升失败', error.stack);
      throw error;
    }
  }

  private calculateNewLevel(points: number, currentLevel: number): number {
    // 实现等级计算逻辑
    const levelThresholds = [100, 300, 600, 1000, 2000];
    return levelThresholds.findIndex(threshold => points < threshold) + 1;
  }
}
