/**
 * @fileoverview TS 文件 advanced-health-metrics.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 综合健康指标
export interface IComprehensiveHealthMetrics {
  /** vitalSigns 的描述 */
  vitalSigns: {
    bloodPressure: VitalMetric;
    heartRate: VitalMetric;
    respiratoryRate: VitalMetric;
    bodyTemperature: VitalMetric;
  };
  /** biochemicalMarkers 的描述 */
  biochemicalMarkers: {
    bloodSugar: BiochemicalMetric;
    cholesterol: BiochemicalMetric;
    hormones: BiochemicalMetric[];
    inflammation: BiochemicalMetric;
  };
  /** physicalMetrics 的描述 */
  physicalMetrics: {
    bodyComposition: PhysicalMetric;
    flexibility: PhysicalMetric;
    strength: PhysicalMetric;
    endurance: PhysicalMetric;
  };
  /** cognitiveMetrics 的描述 */
  cognitiveMetrics: {
    memory: CognitiveMetric;
    attention: CognitiveMetric;
    processingSpeed: CognitiveMetric;
    executiveFunction: CognitiveMetric;
  };
  /** overallHealth 的描述 */
  overallHealth: number;
  /** trends 的描述 */
  trends: HealthTrend[];
}

// 个性化健康建议
export interface IPersonalizedHealthAdvice {
  /** dailyRecommendations 的描述 */
  dailyRecommendations: DailyAdvice[];
  /** weeklyGoals 的描述 */
  weeklyGoals: WeeklyGoal[];
  /** longTermObjectives 的描述 */
  longTermObjectives: LongTermObjective[];
  /** customizedPlans 的描述 */
  customizedPlans: CustomPlan[];
  /** adaptiveGuidance 的描述 */
  adaptiveGuidance: AdaptiveGuidance;
}

// 高级健康预测
export interface IAdvancedHealthPredictions {
  /** shortTermPredictions 的描述 */
  shortTermPredictions: Prediction[];
  /** mediumTermPredictions 的描述 */
  mediumTermPredictions: Prediction[];
  /** longTermPredictions 的描述 */
  longTermPredictions: Prediction[];
  /** confidenceScores 的描述 */
  confidenceScores: ConfidenceScore[];
  /** preventiveActions 的描述 */
  preventiveActions: PreventiveAction[];
}

// 安全健康数据
export interface ISecureHealthData {
  /** secureData 的描述 */
  secureData: EncryptedData;
  /** accessPolicies 的描述 */
  accessPolicies: AccessPolicy[];
  /** auditTrail 的描述 */
  auditTrail: AuditRecord[];
  /** privacyMetrics 的描述 */
  privacyMetrics: PrivacyMetric[];
}
