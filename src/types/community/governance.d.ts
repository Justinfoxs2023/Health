// 内容标准
export interface ContentStandards {
  qualityGuidelines: {
    originalityRequirements: OriginalityConfig;
    professionalStandards: ProfessionalConfig;
    valueContribution: ValueMetrics;
  };
  moderationRules: {
    contentReview: ReviewSystem;
    violationHandling: ViolationSystem;
    appealProcess: AppealSystem;
  };
  qualityMetrics: QualityMetric[];
  enforcementSystem: EnforcementConfig;
}

// 用户管理
export interface UserManagement {
  creditSystem: {
    creditScoring: ScoringSystem;
    behaviorTracking: TrackingSystem;
    rewardPunishment: IncentiveSystem;
  };
  disputeResolution: {
    mediationProcess: MediationSystem;
    userProtection: ProtectionSystem;
    feedbackHandling: FeedbackSystem;
  };
  userMetrics: UserMetric[];
  governanceReports: Report[];
}

// 社区规范
export interface CommunityStandards {
  ruleEnforcement: {
    standardsMonitoring: MonitoringSystem;
    violationDetection: DetectionSystem;
    actionEnforcement: EnforcementSystem;
  };
  communityModeration: {
    moderatorSystem: ModeratorConfig;
    peerReview: ReviewSystem;
    escalationProcess: EscalationConfig;
  };
  complianceTracking: ComplianceMetric[];
  standardsReporting: Report[];
}

// 治理分析
export interface GovernanceAnalytics {
  performanceMetrics: {
    contentQuality: QualityMetric[];
    userBehavior: BehaviorMetric[];
    moderationEfficiency: EfficiencyMetric[];
  };
  trendAnalysis: {
    violationTrends: TrendAnalysis;
    userTrustTrends: TrendAnalysis;
    communityHealthTrends: HealthMetrics;
  };
  insightReports: Report[];
  recommendedActions: Action[];
} 