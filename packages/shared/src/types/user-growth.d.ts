/**
 * @fileoverview TS 文件 user-growth.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 用户成长数据接口
export interface IUserGrowthData {
  /** userId 的描述 */
  userId: string;
  /** timeRange 的描述 */
  timeRange: {
    start: Date;
    end: Date;
  };
  /** metrics 的描述 */
  metrics: string[];
}

// 成长评估结果接口
export interface IGrowthEvaluationResult {
  /** userId 的描述 */
  userId: string;
  /** healthProgress 的描述 */
  healthProgress: IHealthProgressMetrics;
  /** communityContribution 的描述 */
  communityContribution: ICommunityContributionMetrics;
  /** promotionEffectiveness 的描述 */
  promotionEffectiveness: IPromotionMetrics;
  /** achievements 的描述 */
  achievements: Achievement[];
  /** timestamp 的描述 */
  timestamp: Date;
}

// 成长路径规划接口
export interface IGrowthPathPlan {
  /** userId 的描述 */
  userId: string;
  /** currentLevel 的描述 */
  currentLevel: number;
  /** targetLevel 的描述 */
  targetLevel: number;
  /** milestones 的描述 */
  milestones: GrowthMilestone[];
  /** recommendations 的描述 */
  recommendations: GrowthRecommendation[];
  /** timeline 的描述 */
  timeline: Timeline;
}

// 健康进展指标
interface IHealthProgressMetrics {
  /** goals 的描述 */
  goals: HealthGoal[];
  /** achievements 的描述 */
  achievements: HealthAchievement[];
  /** trends 的描述 */
  trends: HealthTrend[];
}

// 社区贡献指标
interface ICommunityContributionMetrics {
  /** posts 的描述 */
  posts: number;
  /** interactions 的描述 */
  interactions: number;
  /** helpfulRatings 的描述 */
  helpfulRatings: number;
  /** influence 的描述 */
  influence: number;
}

// 推广效果指标
interface IPromotionMetrics {
  /** directReferrals 的描述 */
  directReferrals: number;
  /** indirectReferrals 的描述 */
  indirectReferrals: number;
  /** conversionRate 的描述 */
  conversionRate: number;
  /** revenueGenerated 的描述 */
  revenueGenerated: number;
}
