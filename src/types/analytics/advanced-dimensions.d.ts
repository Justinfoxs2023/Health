// 生活方式分析
export interface LifestyleAnalysis {
  exerciseAnalysis: {
    frequency: number;
    intensity: number;
    duration: number;
    types: string[];
  };
  dietaryAnalysis: {
    nutritionBalance: number;
    mealPatterns: string[];
    preferences: string[];
    restrictions: string[];
  };
  sleepAnalysis: {
    quality: number;
    duration: number;
    patterns: string[];
    disturbances: string[];
  };
  recommendations: LifestyleRecommendation[];
}

// 社交互动分析
export interface SocialInteractionAnalysis {
  communityMetrics: {
    participation: number;
    influence: number;
    connections: number;
  };
  expertInteractionMetrics: {
    frequency: number;
    quality: number;
    feedback: string[];
  };
  eventMetrics: {
    attendance: number;
    engagement: number;
    feedback: string[];
  };
  socialScore: number;
}

// 心理健康分析
export interface MentalWellbeingAnalysis {
  stressAnalysis: {
    level: number;
    triggers: string[];
    copingMechanisms: string[];
  };
  emotionalAnalysis: {
    states: EmotionalState[];
    patterns: string[];
    stability: number;
  };
  resilienceScore: number;
  supportRecommendations: SupportRecommendation[];
}

// 健康风险预测
export interface HealthRiskPrediction {
  riskFactors: RiskFactor[];
  riskLevel: {
    current: number;
    projected: number;
    trend: string;
  };
  preventiveMeasures: PreventiveMeasure[];
  monitoringPlan: MonitoringPlan;
} 