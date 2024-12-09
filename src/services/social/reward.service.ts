export class RewardService {
  private readonly pointsRepo: PointsRepository;
  private readonly achievementRepo: AchievementRepository;
  private readonly logger: Logger;

  // 更新用户积分
  async updatePoints(userId: string, action: PointAction): Promise<PointsUpdate> {
    try {
      // 获取积分规则
      const pointRule = this.getPointRule(action);
      
      // 更新积分
      const update = await this.pointsRepo.updatePoints(userId, pointRule.points);
      
      // 检查成就
      await this.checkAchievements(userId, update.totalPoints);
      
      // 发送积分通知
      await this.notifyPointsUpdate(userId, pointRule);

      return update;
    } catch (error) {
      this.logger.error('更新积分失败', error);
      throw error;
    }
  }

  // 检查成就
  private async checkAchievements(userId: string, points: number): Promise<void> {
    const achievements = await this.achievementRepo.findUnlockable(points);
    
    for (const achievement of achievements) {
      await this.unlockAchievement(userId, achievement.id);
    }
  }

  // 解锁成就
  private async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    await this.achievementRepo.unlock(userId, achievementId);
    await this.notifyAchievementUnlocked(userId, achievementId);
  }
} 