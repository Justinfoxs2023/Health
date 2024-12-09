// 每日任务奖励
export interface DailyTaskRewards {
  checkInStatus: {
    points: number;
    streak: number;
    nextMilestone: Milestone;
  };
  contentCreation: {
    dailyPoints: number;
    qualityBonus: number;
    contentStats: ContentStats;
  };
  interactionRewards: InteractionReward[];
  dailyProgress: Progress;
  bonusOpportunities: Opportunity[];
}

// 内容里程碑
export interface ContentMilestones {
  contentMilestones: {
    currentBadges: Badge[];
    nextMilestones: Milestone[];
    milestoneProgress: Progress;
  };
  specialAchievements: {
    monthlyAwards: Award[];
    contributionAwards: Award[];
    innovationAwards: Award[];
  };
  achievementStats: AchievementStats;
  rewardHistory: RewardRecord[];
}

// 荣誉认证
export interface HonorCertification {
  certificationStatus: {
    currentTitles: Title[];
    certificationLevel: Level;
    validityPeriod: Period;
  };
  honorMetrics: {
    qualityScore: number;
    contributionScore: number;
    expertiseScore: number;
  };
  certificationBenefits: Benefit[];
  upgradePath: UpgradePath;
}

// 积分系统
export interface PointsSystem {
  pointsBalance: {
    total: number;
    available: number;
    pending: number;
  };
  levelStatus: {
    currentLevel: Level;
    nextLevel: Level;
    progressPercentage: number;
  };
  pointsHistory: PointsRecord[];
  redemptionOptions: RedemptionOption[];
} 