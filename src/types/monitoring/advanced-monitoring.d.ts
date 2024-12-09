// 多维度评估
export interface MultiDimensionalEvaluation {
  dimensions: {
    userExperience: DimensionEvaluation;
    efficiency: DimensionEvaluation;
    value: DimensionEvaluation;
    innovation: DimensionEvaluation;
    reliability: DimensionEvaluation;
  };
  compositeScore: number;
  trends: TrendAnalysis[];
  recommendations: Recommendation[];
}

// 预测性分析
export interface PredictiveAnalysis {
  predictedMetrics: PredictedMetric[];
  confidenceIntervals: ConfidenceInterval[];
  riskFactors: RiskFactor[];
  preventiveActions: Action[];
}

// 竞争力分析
export interface CompetitivenessAnalysis {
  marketPosition: MarketPosition;
  competitiveAdvantages: Advantage[];
  improvementOpportunities: Opportunity[];
  strategicRecommendations: Strategy[];
}

// 服务健康监控
export interface HealthMonitoring {
  healthStatus: HealthStatus;
  anomalies: Anomaly[];
  riskLevel: RiskLevel;
  recommendedActions: Action[];
}

// 预警规则管理
export interface AlertRuleManagement {
  currentRules: AlertRule[];
  ruleEffectiveness: Effectiveness[];
  optimizedRules: AlertRule[];
  implementationPlan: ImplementationPlan;
} 