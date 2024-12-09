// 行为分析
export interface BehaviorAnalysis {
  usagePatterns: {
    featureUsage: FeatureUsage[];
    preferences: ServicePreference[];
    interactions: InteractionMetric[];
  };
  insights: BehaviorInsight[];
  recommendations: Recommendation[];
}

// 健康趋势分析
export interface HealthTrendAnalysis {
  progressTracking: ProgressMetric[];
  goalAchievements: Achievement[];
  healthImprovements: Improvement[];
  projections: HealthProjection[];
}

// 保留策略
export interface RetentionStrategy {
  engagementPrograms: {
    campaigns: Campaign[];
    promotions: Promotion[];
    rewards: Reward[];
  };
  effectiveness: EffectivenessMetric[];
  timeline: ImplementationTimeline;
}

// 流失预防分析
export interface ChurnPreventionAnalysis {
  riskLevel: RiskLevel;
  warningSignals: WarningSignal[];
  interventionPlan: InterventionProgram[];
  winbackStrategy: WinbackCampaign[];
  predictedOutcomes: PredictedOutcome[];
}

// 辅助类型定义
export interface FeatureUsage {
  featureId: string;
  usageFrequency: number;
  usageDuration: number;
  lastUsed: Date;
}

export interface ServicePreference {
  serviceId: string;
  preferenceLevel: number;
  usagePattern: string;
  feedback: string[];
}

export interface InteractionMetric {
  type: string;
  frequency: number;
  quality: number;
  engagement: number;
} 