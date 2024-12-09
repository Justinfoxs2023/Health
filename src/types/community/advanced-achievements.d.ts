// 健康成就
export interface HealthAchievements {
  healthGoals: {
    completed: HealthGoal[];
    inProgress: HealthGoal[];
    upcoming: HealthGoal[];
  };
  healthMilestones: Milestone[];
  activeHealthChallenges: Challenge[];
  healthProgress: ProgressMetric[];
  specialAchievements: SpecialAchievement[];
}

// 社交成就
export interface SocialAchievements {
  influenceMetrics: {
    reach: number;
    impact: number;
    engagement: number;
  };
  communityContributions: Contribution[];
  interactionAchievements: Achievement[];
  socialRanking: Ranking;
  mentorshipProgress: MentorshipMetric[];
}

// 专业成就
export interface ProfessionalAchievements {
  expertiseLevel: {
    level: number;
    domain: string[];
    recognition: Recognition[];
  };
  knowledgeContributions: Contribution[];
  professionalGrowth: GrowthMetric[];
  certifications: Certification[];
  menteeSuccess: SuccessMetric[];
}

// 动态激励
export interface DynamicIncentives {
  personalizedRewards: {
    immediate: Reward[];
    shortTerm: Reward[];
    longTerm: Reward[];
  };
  engagementPatterns: Pattern[];
  rewardTiming: TimingStrategy;
  adaptiveGoals: AdaptiveGoal[];
  motivationFactors: MotivationFactor[];
}

// 健康目标
export interface HealthGoal {
  id: string;
  type: HealthGoalType;
  target: number;
  progress: number;
  deadline: Date;
  rewards: Reward[];
}

// 激励模式
export interface Pattern {
  type: PatternType;
  frequency: number;
  intensity: number;
  consistency: number;
  triggers: Trigger[];
}

// 动态目标
export interface AdaptiveGoal {
  baseTarget: number;
  adjustmentFactors: Factor[];
  personalizedTarget: number;
  adaptiveRewards: Reward[];
} 