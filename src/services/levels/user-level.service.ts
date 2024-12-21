import { EventEmitter2 } from 'eventemitter2';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserGameProfile } from '../../entities/gamification';

@Injectable()
export class UserLevelService {
  constructor(
    @InjectRepository()
    private readonly userProfileRepo: Repository<UserGameProfile>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async gainExperience(userId: string, expGained: number) {
    const user = await this.userProfileRepo.findOne({ where: { userId } });
    user.experience += expGained;

    // 检查是否升级
    while (user.experience >= user.nextLevelExp) {
      user.level += 1;
      user.experience -= user.nextLevelExp;
      // 计算下一级所需经验
      user.nextLevelExp = this.calculateNextLevelExp(user.level);
    }

    await this.userProfileRepo.save(user);
  }

  private calculateNextLevelExp(level: number): number {
    return Math.floor(1000 * Math.pow(1.2, level - 1));
  }

  // 添加新手引导奖励
  async completeOnboardingStep(userId: string, step: string) {
    const user = await this.userProfileRepo.findOne({ where: { userId } });
    const rewards = this.calculateOnboardingRewards(step);

    user.experience += rewards.experience;
    user.achievements.push(rewards.achievement);

    // 解锁对应功能
    if (rewards.unlockedFeatures) {
      user.features.push(...rewards.unlockedFeatures);
    }

    await this.userProfileRepo.save(user);
    return rewards;
  }

  // 个性化成长路径推荐
  async recommendGrowthPath(userId: string) {
    const user = await this.userProfileRepo.findOne({
      where: { userId },
      relations: ['activities', 'preferences'],
    });

    return {
      recommendedFeatures: this.analyzeFeaturePreferences(user),
      suggestedSpecializations: this.analyzePotentialSpecializations(user),
      nextMilestones: this.calculateNextMilestones(user),
    };
  }

  private calculateOnboardingRewards(step: string) {
    const rewardMap = {
      profile_complete: { experience: 100, achievement: 'profile_master' },
      first_activity: { experience: 150, achievement: 'first_step' },
      community_join: { experience: 200, achievement: 'community_member' },
      // ... 更多步骤奖励
    };
    return rewardMap[step];
  }

  // 新增新手引导流程
  async processOnboarding(userId: string, step: string) {
    const user = await this.userProfileRepo.findOne({ where: { userId } });

    // 更新进度
    user.onboardingProgress.completedSteps.push(step);

    // 计算奖励
    const rewards = this.calculateOnboardingRewards(step);
    user.experience += rewards.experience;
    user.features.push(...rewards.features);
    user.achievements.push(...rewards.achievements);

    // 检查是否完成所有新手任务
    if (this.isOnboardingComplete(user.onboardingProgress)) {
      await this.completeOnboarding(user);
    }

    await this.userProfileRepo.save(user);
    return rewards;
  }

  // 新增成就系统
  async processAchievement(userId: string, achievementType: string, progress: any) {
    const user = await this.userProfileRepo.findOne({ where: { userId } });

    // 检查成就完成条件
    const completedAchievements = this.checkAchievements(
      achievementType,
      progress,
      user.achievements,
    );

    if (completedAchievements.length > 0) {
      // 发放成就奖励
      const rewards = await this.grantAchievementRewards(user, completedAchievements);

      // 更新用户数据
      user.achievements.push(...completedAchievements);
      user.experience += rewards.experience;
      user.features.push(...rewards.features);

      await this.userProfileRepo.save(user);
      return rewards;
    }
  }

  private async completeOnboarding(user: UserGameProfile) {
    // 发放完成奖励
    const completionRewards = {
      experience: 500,
      features: ['advanced_tracking', 'social_features'],
      achievements: ['onboarding_master'],
      specialPrivileges: {
        maxProducts: 5,
        maxShowcaseSlots: 3,
      },
    };

    // 更新用户状态
    user.experience += completionRewards.experience;
    user.features.push(...completionRewards.features);
    user.achievements.push(...completionRewards.achievements);

    // 触发新手完成事件
    await this.eventEmitter.emit('onboarding.completed', {
      userId: user.userId,
      rewards: completionRewards,
    });

    return completionRewards;
  }

  private isOnboardingComplete(progress: any) {
    const requiredSteps = [
      'profile_complete',
      'first_activity',
      'community_join',
      'first_achievement',
    ];
    return requiredSteps.every(step => progress.completedSteps.includes(step));
  }

  private analyzeFeaturePreferences(user: UserGameProfile): string[] {
    // 基于用户行为分析推荐功能
    const preferences = [];
    if (user.activities.some(a => a.type === 'health_tracking')) {
      preferences.push('advanced_health_analytics');
    }
    return preferences;
  }

  private analyzePotentialSpecializations(user: UserGameProfile): string[] {
    // 分析用户潜在专精方向
    const potentials = [];
    if (user.achievements.includes('nutrition_master')) {
      potentials.push('nutrition_specialist');
    }
    return potentials;
  }

  private calculateNextMilestones(user: UserGameProfile): any[] {
    // 计算下一个成就里程碑
    return [
      {
        type: 'level',
        current: user.level,
        next: user.level + 1,
        progress: user.experience / this.calculateNextLevelExp(user.level),
      },
    ];
  }

  private checkAchievements(
    achievementType: string,
    progress: any,
    currentAchievements: string[],
  ): string[] {
    // 实现成就检查逻辑
    const achievementConditions = {
      daily_login: { count: 7 },
      activity_complete: { count: 10 },
      social_interaction: { count: 5 },
    };

    const condition = achievementConditions[achievementType];
    if (!condition) return [];

    const newAchievements = [];
    if (progress >= condition.count) {
      const achievementId = `${achievementType}_${condition.count}`;
      if (!currentAchievements.includes(achievementId)) {
        newAchievements.push(achievementId);
      }
    }

    return newAchievements;
  }

  private async grantAchievementRewards(user: UserGameProfile, achievements: string[]) {
    const rewardMap = {
      daily_login_7: { experience: 100, features: ['daily_bonus'] },
      activity_complete_10: { experience: 200, features: ['advanced_tracking'] },
      social_interaction_5: { experience: 150, features: ['group_chat'] },
    };

    const totalRewards = {
      experience: 0,
      features: [] as string[],
    };

    achievements.forEach(achievement => {
      const reward = rewardMap[achievement];
      if (reward) {
        totalRewards.experience += reward.experience;
        totalRewards.features.push(...reward.features);
      }
    });

    return totalRewards;
  }
}
