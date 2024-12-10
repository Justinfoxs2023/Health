// 健康目标相关类型
export interface HealthGoal {
  id: string;
  userId: string;
  type: GoalType;
  category: GoalCategory;
  target: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: GoalStatus;
  adjustments: GoalAdjustment[];
}

// 目标类型
export type GoalType = 'daily' | 'weekly' | 'monthly' | 'long_term';

// 目标分类
export type GoalCategory = 
  | 'steps'
  | 'water_intake'
  | 'exercise_time'
  | 'weight_management'
  | 'fitness_level'
  | 'health_indicators';

// 目标状态
export type GoalStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'adjusted';

// 奖励系统类型
export interface RewardSystem {
  points: PointsSystem;
  badges: BadgeSystem;
  levels: LevelSystem;
  achievements: AchievementSystem;
}

// 积分系统
export interface PointsSystem {
  totalPoints: number;
  currentPoints: number;
  history: PointsHistory[];
  redemptionOptions: RedemptionOption[];
}

// 徽章系统
export interface BadgeSystem {
  earnedBadges: Badge[];
  availableBadges: Badge[];
  progress: BadgeProgress[];
}

// 等级系统
export interface LevelSystem {
  currentLevel: number;
  currentExp: number;
  nextLevelExp: number;
  levelBenefits: LevelBenefit[];
}

// 成就系统
export interface AchievementSystem {
  achievements: Achievement[];
  progress: AchievementProgress[];
  rewards: AchievementReward[];
}

// 社交互动类型
export interface SocialInteraction {
  type: InteractionType;
  userId: string;
  targetId: string;
  content: any;
  timestamp: Date;
  metadata: InteractionMetadata;
}

// 用户画像类型
export interface UserProfile {
  healthMetrics: HealthMetrics;
  behaviors: UserBehavior[];
  socialInteractions: SocialInteraction[];
  preferences: UserPreferences;
  achievements: Achievement[];
} 