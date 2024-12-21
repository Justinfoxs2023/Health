/**
 * @fileoverview TS 文件 governance.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 内容标准
export interface IContentStandards {
  /** qualityGuidelines 的描述 */
  qualityGuidelines: {
    originalityRequirements: OriginalityConfig;
    professionalStandards: ProfessionalConfig;
    valueContribution: ValueMetrics;
  };
  /** moderationRules 的描述 */
  moderationRules: {
    contentReview: ReviewSystem;
    violationHandling: ViolationSystem;
    appealProcess: AppealSystem;
  };
  /** qualityMetrics 的描述 */
  qualityMetrics: QualityMetric[];
  /** enforcementSystem 的描述 */
  enforcementSystem: EnforcementConfig;
}

// 用户管理
export interface IUserManagement {
  /** creditSystem 的描述 */
  creditSystem: {
    creditScoring: ScoringSystem;
    behaviorTracking: TrackingSystem;
    rewardPunishment: IncentiveSystem;
  };
  /** disputeResolution 的描述 */
  disputeResolution: {
    mediationProcess: MediationSystem;
    userProtection: ProtectionSystem;
    feedbackHandling: FeedbackSystem;
  };
  /** userMetrics 的描述 */
  userMetrics: UserMetric[];
  /** governanceReports 的描述 */
  governanceReports: Report[];
}

// 社区规范
export interface ICommunityStandards {
  /** ruleEnforcement 的描述 */
  ruleEnforcement: {
    standardsMonitoring: MonitoringSystem;
    violationDetection: DetectionSystem;
    actionEnforcement: EnforcementSystem;
  };
  /** communityModeration 的描述 */
  communityModeration: {
    moderatorSystem: ModeratorConfig;
    peerReview: ReviewSystem;
    escalationProcess: EscalationConfig;
  };
  /** complianceTracking 的描述 */
  complianceTracking: ComplianceMetric[];
  /** standardsReporting 的描述 */
  standardsReporting: Report[];
}

// 治理分析
export interface IGovernanceAnalytics {
  /** performanceMetrics 的描述 */
  performanceMetrics: {
    contentQuality: QualityMetric;
    userBehavior: BehaviorMetric;
    moderationEfficiency: EfficiencyMetric;
  };
  /** trendAnalysis 的描述 */
  trendAnalysis: {
    violationTrends: TrendAnalysis;
    userTrustTrends: TrendAnalysis;
    communityHealthTrends: HealthMetrics;
  };
  /** insightReports 的描述 */
  insightReports: Report[];
  /** recommendedActions 的描述 */
  recommendedActions: Action[];
}
