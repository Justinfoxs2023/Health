/**
 * @fileoverview TS 文件 value-distribution.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 收入分成
export interface IRevenueSharing {
  /** serviceProviderShare 的描述 */
  serviceProviderShare: {
    baseCommission: ICommissionConfig;
    performanceBonus: {
      qualityBonus: BonusConfig;
      satisfactionBonus: BonusConfig;
      innovationBonus: BonusConfig;
    };
    totalEarnings: EarningsMetric;
  };
  /** platformInvestment 的描述 */
  platformInvestment: {
    technologyInvestment: InvestmentConfig;
    marketingInvestment: InvestmentConfig;
    userProtection: ProtectionConfig;
  };
  /** distributionMetrics 的描述 */
  distributionMetrics: DistributionMetric[];
  /** adjustmentStrategy 的描述 */
  adjustmentStrategy: AdjustmentConfig;
}

// 激励机制
export interface IncentiveMechanism {
  /** performanceRewards 的描述 */
  performanceRewards: {
    serviceQualityAward: AwardConfig;
    innovationServiceAward: AwardConfig;
    userReputationAward: AwardConfig;
  };
  /** rewardDistribution 的描述 */
  rewardDistribution: {
    qualificationCheck: QualificationConfig;
    rewardAllocation: AllocationConfig;
    distributionTracking: TrackingConfig;
  };
  /** performanceTracking 的描述 */
  performanceTracking: PerformanceMetric[];
  /** incentiveOptimization 的描述 */
  incentiveOptimization: OptimizationConfig;
}

// 价值优化
export interface IValueOptimization {
  /** valueEnhancement 的描述 */
  valueEnhancement: {
    serviceValueOptimization: OptimizationPlan;
    revenueOptimization: OptimizationPlan;
    costOptimization: OptimizationPlan;
  };
  /** marketCompetitiveness 的描述 */
  marketCompetitiveness: {
    marketPositioning: PositioningAnalysis;
    competitiveAdvantage: AdvantageAnalysis;
    growthStrategy: StrategyPlan;
  };
  /** sustainabilityPlanning 的描述 */
  sustainabilityPlanning: SustainabilityPlan;
  /** valueMetrics 的描述 */
  valueMetrics: ValueMetric[];
}

// 分配策略
export interface IDistributionStrategy {
  /** strategyPlanning 的描述 */
  strategyPlanning: {
    shortTermStrategy: StrategyPlan;
    mediumTermStrategy: StrategyPlan;
    longTermStrategy: StrategyPlan;
  };
  /** riskManagement 的描述 */
  riskManagement: {
    riskAssessment: RiskAnalysis;
    mitigationPlans: MitigationPlan;
    contingencyPlanning: ContingencyPlan;
  };
  /** strategyOptimization 的描述 */
  strategyOptimization: OptimizationPlan;
  /** performanceMonitoring 的描述 */
  performanceMonitoring: MonitoringConfig;
}
