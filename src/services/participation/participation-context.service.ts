import {
  ParticipationType,
  IParticipationContext,
  IUserPreferences,
  FamilyRoleType,
  GroupRoleType,
} from '../../types/gamification/base.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SocialInteraction } from '../../entities/gamification/social-interaction.entity';
import { TeamChallenge } from '../../entities/gamification/team-challenge.entity';
import { UserGameProfile } from '../../entities/gamification';

@Injec
table()
export class ParticipationContextService {
  constructor(
    @InjectRepository()
    private readonly userProfileRepo: Repository<UserGameProfile>,
    @InjectRepository()
    private readonly teamChallengeRepo: Repository<TeamChallenge>,
    @InjectRepository()
    private readonly socialInteractionRepo: Repository<SocialInteraction>,
  ) {}

  async createPersonalContext(
    userId: string,
    preferences: IUserPreferences,
  ): Promise<IParticipationContext> {
    return {
      type: 'personal',
      scope: {
        personal: {
          userId,
          preferences,
        },
      },
    };
  }

  async createFamilyContext(
    familyId: string,
    userId: string,
    role: FamilyRoleType,
    members: string[],
  ): Promise<IParticipationContext> {
    return {
      type: 'family',
      scope: {
        family: {
          familyId,
          role,
          members,
        },
      },
    };
  }

  async createSocialContext(
    groupId: string,
    userId: string,
    role: GroupRoleType,
  ): Promise<IParticipationContext> {
    return {
      type: 'social',
      scope: {
        social: {
          groupId,
          role,
          memberCount: await this.getGroupMemberCount(groupId),
        },
      },
    };
  }

  async checkFamilyPermission(
    familyId: string,
    userId: string,
    permission: string,
    targetUserId?: string,
  ): Promise<boolean> {
    const userProfile = await this.userProfileRepo.findOne({ where: { userId } });
    // 实现家庭权限检查逻辑
    return true;
  }

  async checkGroupPermission(
    groupId: string,
    userId: string,
    permission: string,
  ): Promise<boolean> {
    const userProfile = await this.userProfileRepo.findOne({ where: { userId } });
    // 实现群组权限检查逻辑
    return true;
  }

  async switchContext(
    userId: string,
    fromContext: IParticipationContext,
    toContext: IParticipationContext,
  ) {
    // 实现上下文切换逻辑
    return {
      success: true,
      newContext: toContext,
    };
  }

  private async getGroupMemberCount(groupId: string): Promise<number> {
    // 实现获取群组成员数量的逻辑
    return 100;
  }

  // 增加团队挑战机制
  async createTeamChallenge(initiatorId: string, challengeType: string, participants: string[]) {
    const challenge = {
      type: challengeType,
      initiator: initiatorId,
      participants,
      milestones: this.generateChallengeMilestones(challengeType),
      rewards: this.calculateTeamRewards(participants.length),
    };

    return this.teamChallengeRepo.save(challenge);
  }

  // 深化社交互动
  async enhanceInteraction(userId: string, targetId: string, interactionType: string) {
    const interaction = await this.createSocialInteraction(userId, targetId, interactionType);

    // 触发社交奖励
    await this.processSocialRewards(interaction);

    return interaction;
  }

  private async createSocialInteraction(userId: string, targetId: string, interactionType: string) {
    return this.socialInteractionRepo.save({
      userId,
      targetId,
      type: interactionType,
      timestamp: new Date(),
    });
  }

  private async processSocialRewards(interaction: SocialInteraction) {
    // 实现社交奖励逻辑
    const rewards = this.calculateSocialRewards(interaction);
    await this.grantRewards(interaction.userId, rewards);
  }

  private generateChallengeMilestones(challengeType: string) {
    // 实现里程碑生成逻辑
    return [];
  }

  private calculateTeamRewards(participantCount: number) {
    // 实现团队奖励计算逻辑
    return {};
  }
}
