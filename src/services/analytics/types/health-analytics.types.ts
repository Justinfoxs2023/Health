import { IBaseHealthData } from '../../health/types/health-base.types';

// 趋势分析
export interface ITrendAnalysis {
  /** metric 的描述 */
    metric: string;
  /** period 的描述 */
    period: string;
  /** data 的描述 */
    data: Array{
    timestamp: Date;
    value: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  significance: number;
  insights: string[];
}

// 健康预警
export interface IHealthAlert {
  /** type 的描述 */
    type: string;
  /** severity 的描述 */
    severity: low  moderate  high  critical;
  message: string;
  timestamp: Date;
  source: string;
  relatedMetrics: string;
  recommendations: string;
}

// 相关性分析
interface IBaseCorrelation {
  /** factor1 的描述 */
    factor1: string;
  /** factor2 的描述 */
    factor2: string;
  /** strength 的描述 */
    strength: number;  1  1
  confidence: number;  0  1
  description: string;
  significance: number;
}

export interface IExerciseCorrelation extends IBaseCorrelation {
  /** exerciseType 的描述 */
    exerciseType: string;
  /** healthMetric 的描述 */
    healthMetric: string;
  /** timeframe 的描述 */
    timeframe: string;
}

export interface INutritionCorrelation extends IBaseCorrelation {
  /** nutrientType 的描述 */
    nutrientType: string;
  /** healthOutcome 的描述 */
    healthOutcome: string;
  /** delay 的描述 */
    delay: string;
}

export interface IMedicationCorrelation extends IBaseCorrelation {
  /** medication 的描述 */
    medication: string;
  /** effect 的描述 */
    effect: string;
  /** onset 的描述 */
    onset: string;
}

export interface ILifestyleCorrelation extends IBaseCorrelation {
  /** habit 的描述 */
    habit: string;
  /** impact 的描述 */
    impact: string;
  /** duration 的描述 */
    duration: string;
}

// 健康预测
export interface IHealthPrediction {
  /** metric 的描述 */
    metric: string;
  /** value 的描述 */
    value: number;
  /** confidence 的描述 */
    confidence: number;
  /** timeframe 的描述 */
    timeframe: string;
  /** factors 的描述 */
    factors: string;
  /** reliability 的描述 */
    reliability: number;
}

export interface IRiskPrediction {
  /** condition 的描述 */
    condition: string;
  /** probability 的描述 */
    probability: number;
  /** timeframe 的描述 */
    timeframe: string;
  /** factors 的描述 */
    factors: string;
  /** preventiveMeasures 的描述 */
    preventiveMeasures: string;
}

// 建议
interface IBaseRecommendation {
  /** id 的描述 */
    id: string;
  /** priority 的描述 */
    priority: high  medium  low;
  title: string;
  description: string;
  rationale: string;
  expectedBenefits: string;
}

export interface IActionRecommendation extends IBaseRecommendation {
  /** action 的描述 */
    action: string;
  /** timeline 的描述 */
    timeline: string;
  /** steps 的描述 */
    steps: string[];
  /** resources 的描述 */
    resources: string[];
}

export interface ILifestyleRecommendation extends IBaseRecommendation {
  /** currentHabit 的描述 */
    currentHabit: string;
  /** targetHabit 的描述 */
    targetHabit: string;
  /** adaptationPeriod 的描述 */
    adaptationPeriod: string;
  /** milestones 的描述 */
    milestones: string[];
}

export interface IPreventiveRecommendation extends IBaseRecommendation {
  /** risk 的描述 */
    risk: string;
  /** preventiveMeasures 的描述 */
    preventiveMeasures: string[];
  /** monitoringPlan 的描述 */
    monitoringPlan: string[];
  /** followUpSchedule 的描述 */
    followUpSchedule: string;
}

// 相关性分析结果
export interface ICorrelationAnalysis {
  /** correlations 的描述 */
    correlations: IValidatedCorrelation;
  /** insights 的描述 */
    insights: Insight;
  /** recommendations 的描述 */
    recommendations: string;
}

export interface IValidatedCorrelation {
  /** correlation 的描述 */
    correlation: IBaseCorrelation;
  /** validation 的描述 */
    validation: {
    method: string;
    score: number;
    confidence: number;
  };
  /** implications 的描述 */
    implications: string[];
}

export interface Insight {
  /** type 的描述 */
    type: string;
  /** description 的描述 */
    description: string;
  /** confidence 的描述 */
    confidence: number;
  /** actionability 的描述 */
    actionability: number;
  /** recommendations 的描述 */
    recommendations: string;
}

// 健康预测结果
export interface IHealthPredictions {
  /** predictions 的描述 */
    predictions: IHealthPrediction;
  /** risks 的描述 */
    risks: IRiskAssessment;
  /** preventiveActions 的描述 */
    preventiveActions: IPreventiveAction;
}

export interface IRiskAssessment {
  /** risk 的描述 */
    risk: string;
  /** level 的描述 */
    level: low  moderate  high;
  factors: string;
  timeline: string;
  mitigation: string;
}

export interface IPreventiveAction {
  /** action 的描述 */
    action: string;
  /** impact 的描述 */
    impact: string;
  /** effort 的描述 */
    effort: low  medium  high;
  timeline: string;
  steps: string;
}

// 生活方式分析
export interface ILifestyleAnalysis {
  /** currentLifestyle 的描述 */
    currentLifestyle: any;  
  /** impact 的描述 */
    impact: {
    physical: number;
    mental: number;
    social: number;
  };
  /** improvements 的描述 */
    improvements: string[];
  /** expectedBenefits 的描述 */
    expectedBenefits: IExpectedBenefit[];
}

export interface IExpectedBenefit {
  /** area 的描述 */
    area: string;
  /** benefit 的描述 */
    benefit: string;
  /** likelihood 的描述 */
    likelihood: number;
  /** timeframe 的描述 */
    timeframe: string;
  /** requirements 的描述 */
    requirements: string;
}
