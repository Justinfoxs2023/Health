// 综合健康指标
export interface ComprehensiveHealthMetrics {
  vitalSigns: {
    bloodPressure: VitalMetric;
    heartRate: VitalMetric;
    respiratoryRate: VitalMetric;
    bodyTemperature: VitalMetric;
  };
  biochemicalMarkers: {
    bloodSugar: BiochemicalMetric;
    cholesterol: BiochemicalMetric;
    hormones: BiochemicalMetric[];
    inflammation: BiochemicalMetric;
  };
  physicalMetrics: {
    bodyComposition: PhysicalMetric;
    flexibility: PhysicalMetric;
    strength: PhysicalMetric;
    endurance: PhysicalMetric;
  };
  cognitiveMetrics: {
    memory: CognitiveMetric;
    attention: CognitiveMetric;
    processingSpeed: CognitiveMetric;
    executiveFunction: CognitiveMetric;
  };
  overallHealth: number;
  trends: HealthTrend[];
}

// 个性化健康建议
export interface PersonalizedHealthAdvice {
  dailyRecommendations: DailyAdvice[];
  weeklyGoals: WeeklyGoal[];
  longTermObjectives: LongTermObjective[];
  customizedPlans: CustomPlan[];
  adaptiveGuidance: AdaptiveGuidance;
}

// 高级健康预测
export interface AdvancedHealthPredictions {
  shortTermPredictions: Prediction[];
  mediumTermPredictions: Prediction[];
  longTermPredictions: Prediction[];
  confidenceScores: ConfidenceScore[];
  preventiveActions: PreventiveAction[];
}

// 安全健康数据
export interface SecureHealthData {
  secureData: EncryptedData;
  accessPolicies: AccessPolicy[];
  auditTrail: AuditRecord[];
  privacyMetrics: PrivacyMetric[];
} 