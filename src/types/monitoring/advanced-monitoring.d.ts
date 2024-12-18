/**
 * @fileoverview TS 文件 advanced-monitoring.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 多维度评估
export interface IMultiDimensionalEvaluation {
  /** dimensions 的描述 */
  dimensions: {
    userExperience: DimensionEvaluation;
    efficiency: DimensionEvaluation;
    value: DimensionEvaluation;
    innovation: DimensionEvaluation;
    reliability: DimensionEvaluation;
  };
  /** compositeScore 的描述 */
  compositeScore: number;
  /** trends 的描述 */
  trends: TrendAnalysis[];
  /** recommendations 的描述 */
  recommendations: Recommendation[];
}

// 预测性分析
export interface IPredictiveAnalysis {
  /** predictedMetrics 的描述 */
  predictedMetrics: PredictedMetric;
  /** confidenceIntervals 的描述 */
  confidenceIntervals: ConfidenceInterval;
  /** riskFactors 的描述 */
  riskFactors: RiskFactor;
  /** preventiveActions 的描述 */
  preventiveActions: Action;
}

// 竞争力分析
export interface ICompetitivenessAnalysis {
  /** marketPosition 的描述 */
  marketPosition: MarketPosition;
  /** competitiveAdvantages 的描述 */
  competitiveAdvantages: Advantage;
  /** improvementOpportunities 的描述 */
  improvementOpportunities: Opportunity;
  /** strategicRecommendations 的描述 */
  strategicRecommendations: Strategy;
}

// 服务健康监控
export interface IHealthMonitoring {
  /** healthStatus 的描述 */
  healthStatus: HealthStatus;
  /** anomalies 的描述 */
  anomalies: Anomaly;
  /** riskLevel 的描述 */
  riskLevel: RiskLevel;
  /** recommendedActions 的描述 */
  recommendedActions: Action;
}

// 预警规则管理
export interface IAlertRuleManagement {
  /** currentRules 的描述 */
  currentRules: AlertRule;
  /** ruleEffectiveness 的描述 */
  ruleEffectiveness: Effectiveness;
  /** optimizedRules 的描述 */
  optimizedRules: AlertRule;
  /** implementationPlan 的描述 */
  implementationPlan: ImplementationPlan;
}
