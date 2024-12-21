/**
 * @fileoverview TS 文件 incentive.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 成就系统
export interface IAchievementSystem {
  /** unlockedAchievements 的描述 */
  unlockedAchievements: IAchievement[];
  /** newUnlocks 的描述 */
  newUnlocks: IAchievement[];
  /** currentProgress 的描述 */
  currentProgress: AchievementProgress[];
  /** rewards 的描述 */
  rewards: AchievementReward[];
  /** nextMilestones 的描述 */
  nextMilestones: Milestone[];
}

// 积分系统
export interface IPointsSystem {
  /** totalPoints 的描述 */
  totalPoints: number;
  /** pointsHistory 的描述 */
  pointsHistory: IPointsRecord[];
  /** pointsSources 的描述 */
  pointsSources: PointsSource[];
  /** redeemableRewards 的描述 */
  redeemableRewards: Reward[];
  /** pointsProjection 的描述 */
  pointsProjection: PointsProjection;
}

// 荣誉系统
export interface IHonorSystem {
  /** currentHonors 的描述 */
  currentHonors: IHonor[];
  /** eligibleHonors 的描述 */
  eligibleHonors: IHonor[];
  /** honorHistory 的描述 */
  honorHistory: HonorRecord[];
  /** specialRecognitions 的描述 */
  specialRecognitions: Recognition[];
  /** upcomingHonors 的描述 */
  upcomingHonors: IHonor[];
}

// 贡献激励
export interface IContributionIncentives {
  /** contributionMetrics 的描述 */
  contributionMetrics: ContributionMetric[];
  /** earnedIncentives 的描述 */
  earnedIncentives: Incentive[];
  /** availableIncentives 的描述 */
  availableIncentives: Incentive[];
  /** incentivePlans 的描述 */
  incentivePlans: IncentivePlan[];
  /** specialPrograms 的描述 */
  specialPrograms: SpecialProgram[];
}

// 成就
export interface IAchievement {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** category 的描述 */
  category: AchievementCategory;
  /** requirements 的描述 */
  requirements: Requirement[];
  /** rewards 的描述 */
  rewards: Reward[];
  /** unlockedAt 的描述 */
  unlockedAt?: Date;
}

// 积分记录
export interface IPointsRecord {
  /** amount 的描述 */
  amount: number;
  /** source 的描述 */
  source: PointsSource;
  /** timestamp 的描述 */
  timestamp: Date;
  /** description 的描述 */
  description: string;
  /** category 的描述 */
  category: PointsCategory;
}

// 荣誉
export interface IHonor {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** level 的描述 */
  level: HonorLevel;
  /** benefits 的描述 */
  benefits: Benefit[];
  /** validityPeriod 的描述 */
  validityPeriod?: Period;
}

// 激励计划
export interface IncentivePlan {
  /** id 的描述 */
  id: string;
  /** targets 的描述 */
  targets: Target[];
  /** rewards 的描述 */
  rewards: Reward[];
  /** duration 的描述 */
  duration: Period;
  /** milestones 的描述 */
  milestones: Milestone[];
  /** progress 的描述 */
  progress: Progress;
}
