// 收入分成
export interface RevenueSharing {
  serviceProviderShare: {
    baseCommission: CommissionConfig;
    performanceBonus: {
      qualityBonus: BonusConfig;
      satisfactionBonus: BonusConfig;
      innovationBonus: BonusConfig;
    };
    totalEarnings: EarningsMetric;
  };
  platformInvestment: {
    technologyInvestment: InvestmentConfig;
    marketingInvestment: InvestmentConfig;
    userProtection: ProtectionConfig;
  };
  distributionMetrics: DistributionMetric[];
  adjustmentStrategy: AdjustmentConfig;
}

// 激励机制
export interface IncentiveMechanism {
  performanceRewards: {
    serviceQualityAward: AwardConfig;
    innovationServiceAward: AwardConfig;
    userReputationAward: AwardConfig;
  };
  rewardDistribution: {
    qualificationCheck: QualificationConfig;
    rewardAllocation: AllocationConfig;
    distributionTracking: TrackingConfig;
  };
  performanceTracking: PerformanceMetric[];
  incentiveOptimization: OptimizationConfig;
}

// 价值优化
export interface ValueOptimization {
  valueEnhancement: {
    serviceValueOptimization: OptimizationPlan;
    revenueOptimization: OptimizationPlan;
    costOptimization: OptimizationPlan;
  };
  marketCompetitiveness: {
    marketPositioning: PositioningAnalysis;
    competitiveAdvantage: AdvantageAnalysis;
    growthStrategy: StrategyPlan;
  };
  sustainabilityPlanning: SustainabilityPlan;
  valueMetrics: ValueMetric[];
}

// 分配策略
export interface DistributionStrategy {
  strategyPlanning: {
    shortTermStrategy: StrategyPlan;
    mediumTermStrategy: StrategyPlan;
    longTermStrategy: StrategyPlan;
  };
  riskManagement: {
    riskAssessment: RiskAnalysis;
    mitigationPlans: MitigationPlan;
    contingencyPlanning: ContingencyPlan;
  };
  strategyOptimization: OptimizationPlan;
  performanceMonitoring: MonitoringConfig;
} 