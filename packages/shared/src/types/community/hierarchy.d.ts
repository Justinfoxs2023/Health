// 用户等级状态
export interface UserLevelStatus {
  currentLevel: UserLevel;
  metrics: LevelMetrics;
  privileges: Privilege[];
  nextLevelRequirements: LevelRequirement[];
  progressStatus: ProgressStatus;
}

// 贡献度评估
export interface ContributionEvaluation {
  contentMetrics: ContentQuality;
  interactionMetrics: InteractionQuality;
  influenceMetrics: InfluenceMetrics;
  overallScore: number;
  rewards: ContributionReward[];
}

// 权限管理
export interface PrivilegeManagement {
  activePrivileges: Privilege[];
  restrictions: Restriction[];
  specialPermissions: Permission[];
  auditLog: AuditRecord[];
}

// 活动管理
export interface ActivityManagement {
  availableActivities: Activity[];
  organizationPermissions: OrganizationPermission[];
  participationHistory: ParticipationRecord[];
  recommendedActivities: Activity[];
  rewards: ActivityReward[];
}

// 用户等级
export enum UserLevel {
  BEGINNER = '健康新手',
  EXPERT = '健康达人',
  PROFESSIONAL = '健康专家',
  LEADER = '社区领袖'
}

// 等级指标
export interface LevelMetrics {
  points: number;
  activeDays: number;
  contributions: number;
  qualityPosts: number;
  followers: number;
}

// 内容质量
export interface ContentQuality {
  originalityScore: number;
  accuracyScore: number;
  engagementRate: number;
  reportCount: number;
}

// 互动质量
export interface InteractionQuality {
  responseRate: number;
  helpfulnessScore: number;
  communityImpact: number;
} 