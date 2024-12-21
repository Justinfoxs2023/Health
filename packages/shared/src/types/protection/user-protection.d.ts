/**
 * @fileoverview TS 文件 user-protection.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 权益保障
export interface IRightsGuarantee {
  /** serviceGuarantee 的描述 */
  serviceGuarantee: {
    qualityDeposit: DepositConfig;
    refundPolicy: RefundConfig;
    priceCompensation: CompensationConfig;
  };
  /** privacyProtection 的描述 */
  privacyProtection: {
    dataEncryption: EncryptionConfig;
    accessControl: AccessConfig;
    privacyCompensation: PrivacyCompConfig;
  };
  /** disputeResolution 的描述 */
  disputeResolution: {
    arbitrationChannel: ArbitrationConfig;
    thirdPartyEvaluation: EvaluationConfig;
    mediationService: MediationConfig;
  };
}

// 反馈系统
export interface IFeedbackSystem {
  /** complaintChannels 的描述 */
  complaintChannels: {
    hotline: HotlineConfig;
    onlineSupport: SupportConfig;
    ticketSystem: TicketConfig;
  };
  /** improvementMechanism 的描述 */
  improvementMechanism: {
    suggestionRewards: RewardConfig;
    problemTracking: TrackingConfig;
    serviceOptimization: OptimizationConfig;
  };
  /** feedbackAnalytics 的描述 */
  feedbackAnalytics: AnalyticsConfig;
  /** satisfactionTracking 的描述 */
  satisfactionTracking: TrackingConfig;
}

// 保护监控
export interface IProtectionMonitoring {
  /** rightsProtection 的描述 */
  rightsProtection: {
    guaranteeMonitoring: GuaranteeMetrics;
    privacyMonitoring: PrivacyMetrics;
    disputeMonitoring: DisputeMetrics;
  };
  /** feedbackEffectiveness 的描述 */
  feedbackEffectiveness: {
    responseEfficiency: EfficiencyMetric;
    resolutionRate: ResolutionMetric;
    satisfactionLevel: SatisfactionMetric;
  };
  /** systemPerformance 的描述 */
  systemPerformance: PerformanceMetric[];
  /** improvementTracking 的描述 */
  improvementTracking: ImprovementMetric[];
}
