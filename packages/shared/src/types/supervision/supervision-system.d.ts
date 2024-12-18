/**
 * @fileoverview TS 文件 supervision-system.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 日常监控
export interface IDailyMonitoring {
  /** serviceQualityMonitoring 的描述 */
  serviceQualityMonitoring: {
    qualityMetrics: QualityMetrics;
    warningSystem: WarningSystem;
    realTimeAlerts: AlertSystem;
  };
  /** complianceMonitoring 的描述 */
  complianceMonitoring: {
    ethicsReview: EthicsReview;
    standardsInspection: StandardsInspection;
    securityManagement: SecurityManagement;
  };
  /** monitoringReports 的描述 */
  monitoringReports: Report[];
  /** complianceTracking 的描述 */
  complianceTracking: ComplianceStatus;
}

// 处罚机制
export interface IPenaltyMechanism {
  /** violationHandling 的描述 */
  violationHandling: {
    firstOffenseActions: FirstOffenseConfig;
    secondOffenseActions: SecondOffenseConfig;
    thirdOffenseActions: ThirdOffenseConfig;
  };
  /** compensationRules 的描述 */
  compensationRules: {
    serviceFailure: FailureCompensation;
    qualityIssues: QualityCompensation;
    seriousViolations: ViolationCompensation;
  };
  /** penaltyTracking 的描述 */
  penaltyTracking: TrackingSystem;
  /** appealSystem 的描述 */
  appealSystem: AppealConfig;
}

// 监管报告
export interface ISupervisionReporting {
  /** complianceReports 的描述 */
  complianceReports: {
    dailyReports: Report[];
    violationReports: ViolationReport[];
    trendAnalysis: TrendAnalysis;
  };
  /** performanceMetrics 的描述 */
  performanceMetrics: {
    supervisionEffectiveness: EffectivenessMetric;
    complianceRate: ComplianceMetric;
    violationTrends: TrendMetric;
  };
  /** systemImprovement 的描述 */
  systemImprovement: ImprovementSuggestion[];
  /** stakeholderUpdates 的描述 */
  stakeholderUpdates: StakeholderReport[];
}
