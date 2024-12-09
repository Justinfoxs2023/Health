// 日常监控
export interface DailyMonitoring {
  serviceQualityMonitoring: {
    qualityMetrics: QualityMetrics;
    warningSystem: WarningSystem;
    realTimeAlerts: AlertSystem;
  };
  complianceMonitoring: {
    ethicsReview: EthicsReview;
    standardsInspection: StandardsInspection;
    securityManagement: SecurityManagement;
  };
  monitoringReports: Report[];
  complianceTracking: ComplianceStatus;
}

// 处罚机制
export interface PenaltyMechanism {
  violationHandling: {
    firstOffenseActions: FirstOffenseConfig;
    secondOffenseActions: SecondOffenseConfig;
    thirdOffenseActions: ThirdOffenseConfig;
  };
  compensationRules: {
    serviceFailure: FailureCompensation;
    qualityIssues: QualityCompensation;
    seriousViolations: ViolationCompensation;
  };
  penaltyTracking: TrackingSystem;
  appealSystem: AppealConfig;
}

// 监管报告
export interface SupervisionReporting {
  complianceReports: {
    dailyReports: Report[];
    violationReports: ViolationReport[];
    trendAnalysis: TrendAnalysis;
  };
  performanceMetrics: {
    supervisionEffectiveness: EffectivenessMetric;
    complianceRate: ComplianceMetric;
    violationTrends: TrendMetric;
  };
  systemImprovement: ImprovementSuggestion[];
  stakeholderUpdates: StakeholderReport[];
} 