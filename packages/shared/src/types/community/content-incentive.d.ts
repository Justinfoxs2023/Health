/**
 * @fileoverview TS 文件 content-incentive.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 每日任务奖励
export interface IDailyTaskRewards {
  /** checkInStatus 的描述 */
  checkInStatus: {
    points: number;
    streak: number;
    nextMilestone: Milestone;
  };
  /** contentCreation 的描述 */
  contentCreation: {
    dailyPoints: number;
    qualityBonus: number;
    contentStats: ContentStats;
  };
  /** interactionRewards 的描述 */
  interactionRewards: InteractionReward[];
  /** dailyProgress 的描述 */
  dailyProgress: Progress;
  /** bonusOpportunities 的描述 */
  bonusOpportunities: Opportunity[];
}

// 内容里程碑
export interface IContentMilestones {
  /** contentMilestones 的描述 */
  contentMilestones: {
    currentBadges: Badge[];
    nextMilestones: Milestone[];
    milestoneProgress: Progress;
  };
  /** specialAchievements 的描述 */
  specialAchievements: {
    monthlyAwards: Award[];
    contributionAwards: Award[];
    innovationAwards: Award[];
  };
  /** achievementStats 的描述 */
  achievementStats: AchievementStats;
  /** rewardHistory 的描述 */
  rewardHistory: RewardRecord[];
}

// 荣誉认证
export interface IHonorCertification {
  /** certificationStatus 的描述 */
  certificationStatus: {
    currentTitles: Title[];
    certificationLevel: Level;
    validityPeriod: Period;
  };
  /** honorMetrics 的描述 */
  honorMetrics: {
    qualityScore: number;
    contributionScore: number;
    expertiseScore: number;
  };
  /** certificationBenefits 的描述 */
  certificationBenefits: Benefit[];
  /** upgradePath 的描述 */
  upgradePath: UpgradePath;
}

// 积分系统
export interface IPointsSystem {
  /** pointsBalance 的描述 */
  pointsBalance: {
    total: number;
    available: number;
    pending: number;
  };
  /** levelStatus 的描述 */
  levelStatus: {
    currentLevel: Level;
    nextLevel: Level;
    progressPercentage: number;
  };
  /** pointsHistory 的描述 */
  pointsHistory: PointsRecord[];
  /** redemptionOptions 的描述 */
  redemptionOptions: RedemptionOption[];
}
