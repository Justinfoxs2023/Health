/**
 * @fileoverview TS 文件 activity.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 活跃度类型
export type ActivityType =
  any; // AI生活方式指导

// 活跃度等级配置
export interface IActivityLevelConfig {
  /** level 的描述 */
    level: number;
  /** requirements 的描述 */
    requirements: {
    dailyActions: number;
    weeklyActions: number;
    monthlyActions: number;
    continuousLogin: number;
  };
  /** rewards 的描述 */
    rewards: {
    baseExp: number;
    bonusExp: number;
    points: number;
    items?: string[];
    features?: string[];
    tutorials?: string[];
  };
  /** preferences 的描述 */
    preferences?: undefined | { exerciseTypes?: string[] | undefined; intensityLevels?: string[] | undefined; timeSlots?: string[] | undefined; dietTypes?: string[] | undefined; socialFeatures?: string[] | undefined; };
}

// 活跃度奖励规则
export interface IActivityRewardRule {
  /** activityType 的描述 */
    activityType: "daily_login" | "health_record" | "exercise" | "diet_tracking" | "social_interaction" | "expert_consult" | "content_creation" | "help_others" | "challenge_complete" | "achievement_unlock" | "group_exercise" | "health_management" | "fitness_tracking" | "diet_planning" | "lifestyle_coaching";
  /** basePoints 的描述 */
    basePoints: number;
  /** levelMultipliers 的描述 */
    levelMultipliers: Recordnumber, /** number 的描述 */
    /** number 的描述 */
    number;
  /** specialRules 的描述 */
    specialRules: {
    timeBonus: Array{
      startHour: number;
      endHour: number;
      multiplier: number;
    }>;
    qualityBonus?: Array<{
      condition: string;
      multiplier: number;
    }>;
    difficultyBonus?: Array<{
      level: string;
      multiplier: number;
    }>;
    personalizedBonus?: Array<{
      condition: string;
      multiplier: number;
    }>;
  };
  featureUnlocks?: Record<number, string[]>;
  tutorialTriggers?: Record<number, string[]>;
  progressiveUnlocks?: {
    recordCount?: Record<number, string[]>;
    taskCompletion?: Record<number, string[]>;
  };
  socialFeatures?: {
    groupSize?: Record<number, string[]>;
  };
}
