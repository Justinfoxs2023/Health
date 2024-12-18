/**
 * @fileoverview TS 文件 enhanced-gamification.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 健康目标相关类型
export interface IHealthGoal {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** type 的描述 */
  type: "daily" | "weekly" | "monthly" | "long_term";
  /** category 的描述 */
  category: "steps" | "water_intake" | "exercise_time" | "weight_management" | "fitness_level" | "health_indicators";
  /** target 的描述 */
  target: number;
  /** unit 的描述 */
  unit: string;
  /** startDate 的描述 */
  startDate: Date;
  /** endDate 的描述 */
  endDate: Date;
  /** progress 的描述 */
  progress: number;
  /** status 的描述 */
  status: "not_started" | "in_progress" | "completed" | "failed" | "adjusted";
  /** adjustments 的描述 */
  adjustments: GoalAdjustment;
}

// 目标类型
export type GoalType = any;

// 目标分类
export type GoalCategoryType =
  any;

// 目标状态
export type GoalStatusType = any;

// 奖励系统类型
export interface IRewardSystem {
  /** points 的描述 */
  points: IPointsSystem;
  /** badges 的描述 */
  badges: IBadgeSystem;
  /** levels 的描述 */
  levels: ILevelSystem;
  /** achievements 的描述 */
  achievements: IAchievementSystem;
}

// 积分系统
export interface IPointsSystem {
  /** totalPoints 的描述 */
  totalPoints: number;
  /** currentPoints 的描述 */
  currentPoints: number;
  /** history 的描述 */
  history: PointsHistory;
  /** redemptionOptions 的描述 */
  redemptionOptions: RedemptionOption;
}

// 徽章系统
export interface IBadgeSystem {
  /** earnedBadges 的描述 */
  earnedBadges: Badge;
  /** availableBadges 的描述 */
  availableBadges: Badge;
  /** progress 的描述 */
  progress: BadgeProgress;
}

// 等级系统
export interface ILevelSystem {
  /** currentLevel 的描述 */
  currentLevel: number;
  /** currentExp 的描述 */
  currentExp: number;
  /** nextLevelExp 的描述 */
  nextLevelExp: number;
  /** levelBenefits 的描述 */
  levelBenefits: LevelBenefit;
}

// 成就系统
export interface IAchievementSystem {
  /** achievements 的描述 */
  achievements: Achievement;
  /** progress 的描述 */
  progress: AchievementProgress;
  /** rewards 的描述 */
  rewards: AchievementReward;
}

// 社交互动类型
export interface ISocialInteraction {
  /** type 的描述 */
  type: InteractionType;
  /** userId 的描述 */
  userId: string;
  /** targetId 的描述 */
  targetId: string;
  /** content 的描述 */
  content: any;
  /** timestamp 的描述 */
  timestamp: Date;
  /** metadata 的描述 */
  metadata: InteractionMetadata;
}

// 用户画像类型
export interface IUserProfile {
  /** healthMetrics 的描述 */
  healthMetrics: HealthMetrics;
  /** behaviors 的描述 */
  behaviors: UserBehavior;
  /** socialInteractions 的描述 */
  socialInteractions: ISocialInteraction;
  /** preferences 的描述 */
  preferences: UserPreferences;
  /** achievements 的描述 */
  achievements: Achievement;
}
