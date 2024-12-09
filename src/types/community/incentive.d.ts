// 成就系统
export interface AchievementSystem {
  unlockedAchievements: Achievement[];
  newUnlocks: Achievement[];
  currentProgress: AchievementProgress[];
  rewards: AchievementReward[];
  nextMilestones: Milestone[];
}

// 积分系统
export interface PointsSystem {
  totalPoints: number;
  pointsHistory: PointsRecord[];
  pointsSources: PointsSource[];
  redeemableRewards: Reward[];
  pointsProjection: PointsProjection;
}

// 荣誉系统
export interface HonorSystem {
  currentHonors: Honor[];
  eligibleHonors: Honor[];
  honorHistory: HonorRecord[];
  specialRecognitions: Recognition[];
  upcomingHonors: Honor[];
}

// 贡献激励
export interface ContributionIncentives {
  contributionMetrics: ContributionMetric[];
  earnedIncentives: Incentive[];
  availableIncentives: Incentive[];
  incentivePlans: IncentivePlan[];
  specialPrograms: SpecialProgram[];
}

// 成就
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  requirements: Requirement[];
  rewards: Reward[];
  unlockedAt?: Date;
}

// 积分记录
export interface PointsRecord {
  amount: number;
  source: PointsSource;
  timestamp: Date;
  description: string;
  category: PointsCategory;
}

// 荣誉
export interface Honor {
  id: string;
  title: string;
  description: string;
  level: HonorLevel;
  benefits: Benefit[];
  validityPeriod?: Period;
}

// 激励计划
export interface IncentivePlan {
  id: string;
  targets: Target[];
  rewards: Reward[];
  duration: Period;
  milestones: Milestone[];
  progress: Progress;
} 