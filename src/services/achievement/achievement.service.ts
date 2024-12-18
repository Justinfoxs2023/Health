import { Injectable } from '@nestjs/common';
import { LoggerService } from '../common/logger.service';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService, private logger: LoggerService) {}

  async checkAchievements(userId: string, points: number): Promise<void> {
    try {
      // 获取用户当前成就
      const achievements = await this.prisma.achievement.findMany({
        where: { userId },
      });

      // 检查是否达成新成就
      const newAchievements = this.evaluateNewAchievements(points, achievements);

      // 保存新成就
      if (newAchievements.length > 0) {
        await this.prisma.achievement.createMany({
          data: newAchievements.map(achievement => ({
            userId,
            type: achievement.type,
            points: achievement.points,
          })),
        });
      }
    } catch (error) {
      this.logger.error('检查成就失败', error.stack);
      throw error;
    }
  }

  private evaluateNewAchievements(points: number, currentAchievements: any[]): any[] {
    // 实现成就评估逻辑
    return [];
  }
}
