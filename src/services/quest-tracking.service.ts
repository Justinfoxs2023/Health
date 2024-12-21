/**
 * @fileoverview TS 文件 quest-tracking.service.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

@Injectable()
export class QuestTrackingService {
  constructor(
    private readonly levelService: LevelService,
    private readonly rewardService: RewardService,
  ) {}

  async trackQuestProgress(
    userId: string,
    questId: string,
    action: string,
    progress: number,
  ): Promise<void> {
    try {
      // 更新任务进度
      const questProgress = await this.updateQuestProgress(userId, questId, progress);

      // 检查任务完成
      if (questProgress.isCompleted) {
        // 发放奖励
        await this.grantQuestRewards(userId, questId);

        // 检查任务线进度
        await this.checkQuestLineProgress(userId, questProgress.questLineId);

        // 解锁新任务
        await this.unlockNextQuests(userId, questId);
      }

      // 更新成就进度
      await this.updateAchievements(userId, action);
    } catch (error) {
      console.error('Error in quest-tracking.service.ts:', '更新任务进度失败:', error);
      throw error;
    }
  }

  private async unlockNextQuests(userId: string, completedQuestId: string): Promise<void> {
    const userLevel = await this.levelService.getUserLevel(userId);
    const nextQuests = await this.getNextAvailableQuests(userLevel.level);

    // 解锁符合条件的任务
    for (const quest of nextQuests) {
      if (this.checkQuestRequirements(quest, userLevel)) {
        await this.unlockQuest(userId, quest.id);
      }
    }
  }
}
