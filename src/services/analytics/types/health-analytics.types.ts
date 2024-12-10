import { BaseHealthData } from '../../health/types/health-base.types';

// 趋势分析
export interface TrendAnalysis {
  metric: string;
  period: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  significance: number;
  insights: string[];
}

// 健康预警
export interface HealthAlert {
  type: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  source: string;
  relatedMetrics: string[];
  recommendations: string[];
}

// 相关性分析
interface BaseCorrelation {
  factor1: string;
  factor2: string;
  strength: number; // -1 到 1
  confidence: number; // 0 到 1
  description: string;
  significance: number;
}

export interface ExerciseCorrelation extends BaseCorrelation {
  exerciseType: string;
  healthMetric: string;
  timeframe: string;
}

export interface NutritionCorrelation extends BaseCorrelation {
  nutrientType: string;
  healthOutcome: string;
  delay: string;
}

export interface MedicationCorrelation extends BaseCorrelation {
  medication: string;
  effect: string;
  onset: string;
}

export interface LifestyleCorrelation extends BaseCorrelation {
  habit: string;
  impact: string;
  duration: string;
}

// 健康预测
export interface HealthPrediction {
  metric: string;
  value: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  reliability: number;
}

export interface RiskPrediction {
  condition: string;
  probability: number;
  timeframe: string;
  factors: string[];
  preventiveMeasures: string[];
}

// 建议
interface BaseRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  expectedBenefits: string[];
}

export interface ActionRecommendation extends BaseRecommendation {
  action: string;
  timeline: string;
  steps: string[];
  resources: string[];
}

export interface LifestyleRecommendation extends BaseRecommendation {
  currentHabit: string;
  targetHabit: string;
  adaptationPeriod: string;
  milestones: string[];
}

export interface PreventiveRecommendation extends BaseRecommendation {
  risk: string;
  preventiveMeasures: string[];
  monitoringPlan: string[];
  followUpSchedule: string;
}

// 相关性分析结果
export interface CorrelationAnalysis {
  correlations: ValidatedCorrelation[];
  insights: Insight[];
  recommendations: string[];
}

export interface ValidatedCorrelation {
  correlation: BaseCorrelation;
  validation: {
    method: string;
    score: number;
    confidence: number;
  };
  implications: string[];
}

export interface Insight {
  type: string;
  description: string;
  confidence: number;
  actionability: number;
  recommendations: string[];
}

// 健康预测结果
export interface HealthPredictions {
  predictions: HealthPrediction[];
  risks: RiskAssessment[];
  preventiveActions: PreventiveAction[];
}

export interface RiskAssessment {
  risk: string;
  level: 'low' | 'moderate' | 'high';
  factors: string[];
  timeline: string;
  mitigation: string[];
}

export interface PreventiveAction {
  action: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  steps: string[];
}

// 生活方式分析
export interface LifestyleAnalysis {
  currentLifestyle: any; // 根据实际数据结构定义
  impact: {
    physical: number;
    mental: number;
    social: number;
  };
  improvements: string[];
  expectedBenefits: ExpectedBenefit[];
}

export interface ExpectedBenefit {
  area: string;
  benefit: string;
  likelihood: number;
  timeframe: string;
  requirements: string[];
} 