// 权益保障
export interface RightsGuarantee {
  serviceGuarantee: {
    qualityDeposit: DepositConfig;
    refundPolicy: RefundConfig;
    priceCompensation: CompensationConfig;
  };
  privacyProtection: {
    dataEncryption: EncryptionConfig;
    accessControl: AccessConfig;
    privacyCompensation: PrivacyCompConfig;
  };
  disputeResolution: {
    arbitrationChannel: ArbitrationConfig;
    thirdPartyEvaluation: EvaluationConfig;
    mediationService: MediationConfig;
  };
}

// 反馈系统
export interface FeedbackSystem {
  complaintChannels: {
    hotline: HotlineConfig;
    onlineSupport: SupportConfig;
    ticketSystem: TicketConfig;
  };
  improvementMechanism: {
    suggestionRewards: RewardConfig;
    problemTracking: TrackingConfig;
    serviceOptimization: OptimizationConfig;
  };
  feedbackAnalytics: AnalyticsConfig;
  satisfactionTracking: TrackingConfig;
}

// 保护监控
export interface ProtectionMonitoring {
  rightsProtection: {
    guaranteeMonitoring: GuaranteeMetrics;
    privacyMonitoring: PrivacyMetrics;
    disputeMonitoring: DisputeMetrics;
  };
  feedbackEffectiveness: {
    responseEfficiency: EfficiencyMetric;
    resolutionRate: ResolutionMetric;
    satisfactionLevel: SatisfactionMetric;
  };
  systemPerformance: PerformanceMetric[];
  improvementTracking: ImprovementMetric[];
} 