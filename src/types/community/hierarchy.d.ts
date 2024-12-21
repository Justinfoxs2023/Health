/**
 * @fileoverview TS 文件 hierarchy.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 用户等级状态
export interface IUserLevelStatus {
  /** currentLevel 的描述 */
  currentLevel: import("D:/Health/src/types/community/hierarchy").UserLevel.BEGINNER | import("D:/Health/src/types/community/hierarchy").UserLevel.EXPERT | import("D:/Health/src/types/community/hierarchy").UserLevel.PROFESSIONAL | import("D:/Health/src/types/community/hierarchy").UserLevel.LEADER;
  /** metrics 的描述 */
  metrics: ILevelMetrics;
  /** privileges 的描述 */
  privileges: Privilege;
  /** nextLevelRequirements 的描述 */
  nextLevelRequirements: LevelRequirement;
  /** progressStatus 的描述 */
  progressStatus: ProgressStatus;
}

// 贡献度评估
export interface IContributionEvaluation {
  /** contentMetrics 的描述 */
  contentMetrics: IContentQuality;
  /** interactionMetrics 的描述 */
  interactionMetrics: InteractionQuality;
  /** influenceMetrics 的描述 */
  influenceMetrics: InfluenceMetrics;
  /** overallScore 的描述 */
  overallScore: number;
  /** rewards 的描述 */
  rewards: ContributionReward;
}

// 权限管理
export interface IPrivilegeManagement {
  /** activePrivileges 的描述 */
  activePrivileges: Privilege;
  /** restrictions 的描述 */
  restrictions: Restriction;
  /** specialPermissions 的描述 */
  specialPermissions: Permission;
  /** auditLog 的描述 */
  auditLog: AuditRecord;
}

// 活动管理
export interface IActivityManagement {
  /** availableActivities 的描述 */
  availableActivities: Activity;
  /** organizationPermissions 的描述 */
  organizationPermissions: OrganizationPermission;
  /** participationHistory 的描述 */
  participationHistory: ParticipationRecord;
  /** recommendedActivities 的描述 */
  recommendedActivities: Activity;
  /** rewards 的描述 */
  rewards: ActivityReward;
}

// 用户等级
export enum UserLevel {
  BEGINNER = '健康新手',
  EXPERT = '健康达人',
  PROFESSIONAL = '健康专家',
  LEADER = '社区领袖',
}

// 等级指标
export interface ILevelMetrics {
  /** points 的描述 */
  points: number;
  /** activeDays 的描述 */
  activeDays: number;
  /** contributions 的描述 */
  contributions: number;
  /** qualityPosts 的描述 */
  qualityPosts: number;
  /** followers 的描述 */
  followers: number;
}

// 内容质量
export interface IContentQuality {
  /** originalityScore 的描述 */
  originalityScore: number;
  /** accuracyScore 的描述 */
  accuracyScore: number;
  /** engagementRate 的描述 */
  engagementRate: number;
  /** reportCount 的描述 */
  reportCount: number;
}

// 互动质量
export interface InteractionQuality {
  /** responseRate 的描述 */
  responseRate: number;
  /** helpfulnessScore 的描述 */
  helpfulnessScore: number;
  /** communityImpact 的描述 */
  communityImpact: number;
}
