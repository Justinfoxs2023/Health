// 用户成长数据接口
export interface UserGrowthData {
  userId: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
}

// 成长评估结果接口
export interface GrowthEvaluationResult {
  userId: string;
  healthProgress: HealthProgressMetrics;
  communityContribution: CommunityContributionMetrics;
  promotionEffectiveness: PromotionMetrics;
  achievements: Achievement[];
  timestamp: Date;
}

// 成长路径规划接口
export interface GrowthPathPlan {
  userId: string;
  currentLevel: number;
  targetLevel: number;
  milestones: GrowthMilestone[];
  recommendations: GrowthRecommendation[];
  timeline: Timeline;
}

// 健康进展指标
interface HealthProgressMetrics {
  goals: HealthGoal[];
  achievements: HealthAchievement[];
  trends: HealthTrend[];
}

// 社区贡献指标
interface CommunityContributionMetrics {
  posts: number;
  interactions: number;
  helpfulRatings: number;
  influence: number;
}

// 推广效果指标
interface PromotionMetrics {
  directReferrals: number;
  indirectReferrals: number;
  conversionRate: number;
  revenueGenerated: number;
} 