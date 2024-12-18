/**
 * @fileoverview TS 文件 advanced-achievements.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 健康成就
export interface IHealthAchievements {
  /** healthGoals 的描述 */
  healthGoals: {
    completed: IHealthGoal;
    inProgress: IHealthGoal;
    upcoming: IHealthGoal;
  };
  /** healthMilestones 的描述 */
  healthMilestones: Milestone[];
  /** activeHealthChallenges 的描述 */
  activeHealthChallenges: Challenge[];
  /** healthProgress 的描述 */
  healthProgress: ProgressMetric[];
  /** specialAchievements 的描述 */
  specialAchievements: SpecialAchievement[];
}

// 社交成就
export interface ISocialAchievements {
  /** influenceMetrics 的描述 */
  influenceMetrics: {
    reach: number;
    impact: number;
    engagement: number;
  };
  /** communityContributions 的描述 */
  communityContributions: Contribution[];
  /** interactionAchievements 的描述 */
  interactionAchievements: Achievement[];
  /** socialRanking 的描述 */
  socialRanking: Ranking;
  /** mentorshipProgress 的描述 */
  mentorshipProgress: MentorshipMetric[];
}

// 专业成就
export interface IProfessionalAchievements {
  /** expertiseLevel 的描述 */
  expertiseLevel: {
    level: number;
    domain: string;
    recognition: Recognition;
  };
  /** knowledgeContributions 的描述 */
  knowledgeContributions: Contribution[];
  /** professionalGrowth 的描述 */
  professionalGrowth: GrowthMetric[];
  /** certifications 的描述 */
  certifications: Certification[];
  /** menteeSuccess 的描述 */
  menteeSuccess: SuccessMetric[];
}

// 动态激励
export interface IDynamicIncentives {
  /** personalizedRewards 的描述 */
  personalizedRewards: {
    immediate: Reward;
    shortTerm: Reward;
    longTerm: Reward;
  };
  /** engagementPatterns 的描述 */
  engagementPatterns: IPattern[];
  /** rewardTiming 的描述 */
  rewardTiming: TimingStrategy;
  /** adaptiveGoals 的描述 */
  adaptiveGoals: IAdaptiveGoal[];
  /** motivationFactors 的描述 */
  motivationFactors: MotivationFactor[];
}

// 健康目标
export interface IHealthGoal {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: HealthGoalType;
  /** target 的描述 */
  target: number;
  /** progress 的描述 */
  progress: number;
  /** deadline 的描述 */
  deadline: Date;
  /** rewards 的描述 */
  rewards: Reward;
}

// 激励模式
export interface IPattern {
  /** type 的描述 */
  type: PatternType;
  /** frequency 的描述 */
  frequency: number;
  /** intensity 的描述 */
  intensity: number;
  /** consistency 的描述 */
  consistency: number;
  /** triggers 的描述 */
  triggers: Trigger;
}

// 动态目标
export interface IAdaptiveGoal {
  /** baseTarget 的描述 */
  baseTarget: number;
  /** adjustmentFactors 的描述 */
  adjustmentFactors: Factor;
  /** personalizedTarget 的描述 */
  personalizedTarget: number;
  /** adaptiveRewards 的描述 */
  adaptiveRewards: Reward;
}
