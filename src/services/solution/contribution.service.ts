import { Injectable } from '@nestjs/common';
import { 
  Solution, 
  Contribution, 
  ContributionType 
} from '../../types/solution';

@Injectable()
export class ContributionService {
  constructor(
    private readonly solutionService: SolutionService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  // 计算贡献值
  async calculateContributionPoints(
    contribution: Contribution
  ): Promise<number> {
    const basePoints = this.getBasePoints(contribution.type);
    const qualityMultiplier = await this.assessQuality(contribution);
    const impactMultiplier = await this.assessImpact(contribution);
    
    return basePoints * qualityMultiplier * impactMultiplier;
  }

  private getBasePoints(type: ContributionType): number {
    const pointsMap = {
      [ContributionType.FEATURE]: 10,
      [ContributionType.USAGE]: 8,
      [ContributionType.NOTICE]: 6,
      [ContributionType.FAQ]: 5,
      [ContributionType.IMPROVEMENT]: 7
    };
    return pointsMap[type];
  }

  private async assessQuality(contribution: Contribution): Promise<number> {
    // 基于内容长度、格式、完整性等评估质量
    const lengthScore = this.assessLength(contribution.content);
    const formatScore = this.assessFormat(contribution.content);
    const completenessScore = this.assessCompleteness(contribution.content);
    
    return (lengthScore + formatScore + completenessScore) / 3;
  }

  private async assessImpact(contribution: Contribution): Promise<number> {
    // 基于用户反馈、采纳率等评估影响力
    const userFeedback = await this.getUserFeedback(contribution.id);
    const adoptionRate = await this.getAdoptionRate(contribution.id);
    
    return (userFeedback + adoptionRate) / 2;
  }

  // 处理贡献提交
  async handleContribution(
    solutionId: string,
    userId: string,
    contribution: Partial<Contribution>
  ): Promise<Contribution> {
    // 创建贡献记录
    const newContribution = await this.createContribution(
      solutionId,
      userId,
      contribution
    );
    
    // 通知方案拥有者
    await this.notifyVendor(solutionId, newContribution);
    
    return newContribution;
  }

  // 处理贡献审核
  async handleContributionReview(
    contributionId: string,
    approved: boolean,
    comments?: string
  ): Promise<void> {
    const contribution = await this.findContribution(contributionId);
    
    if (approved) {
      // 计算贡献值
      const points = await this.calculateContributionPoints(contribution);
      
      // 更新用户贡献值
      await this.updateUserContribution(
        contribution.userId,
        points
      );
      
      // 更新方案内容
      await this.updateSolutionContent(
        contribution.solutionId,
        contribution
      );
    }
    
    // 更新贡献状态
    await this.updateContributionStatus(
      contributionId,
      approved ? 'accepted' : 'rejected',
      comments
    );
    
    // 通知贡献者
    await this.notifyContributor(contribution, approved, comments);
  }

  // 获取用户贡献统计
  async getUserContributionStats(userId: string): Promise<{
    totalPoints: number;
    contributionCount: number;
    acceptedCount: number;
    topContributions: Contribution[];
  }> {
    const contributions = await this.findUserContributions(userId);
    
    return {
      totalPoints: contributions.reduce((sum, c) => 
        sum + (c.contributionPoints || 0), 0
      ),
      contributionCount: contributions.length,
      acceptedCount: contributions.filter(c => 
        c.status === 'accepted'
      ).length,
      topContributions: this.getTopContributions(contributions)
    };
  }
} 