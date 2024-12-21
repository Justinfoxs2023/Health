import { IBaseHealthData } from '../../health/types/health-base.types';

// AI模型配置
export interface IAIModelConfig {
  /** modelType 的描述 */
    modelType: diagnosis  prediction  recommendation;
  version: string;
  parameters: {
    temperature: number;
    topP: number;
    maxTokens: number;
    presencePenalty: number;
    frequencyPenalty: number;
  };
  specializations: string[];
  languages: string[];
  capabilities: AICapability[];
}

// AI能力
export interface IAICapability {
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** accuracy 的描述 */
    accuracy: number;
  /** requirements 的描述 */
    requirements: string;
  /** limitations 的描述 */
    limitations: string;
}

// 健康风险分析
export interface IHealthRiskAnalysis {
  /** risks 的描述 */
    risks: RiskAssessment;
  /** predictions 的描述 */
    predictions: RiskPrediction;
  /** confidence 的描述 */
    confidence: number;
  /** reasoning 的描述 */
    reasoning: string;
  /** alternatives 的描述 */
    alternatives: RiskPrediction;
}

// 治疗方案分析
export interface ITreatmentAnalysis {
  /** bestOption 的描述 */
    bestOption: TreatmentPlan;
  /** confidence 的描述 */
    confidence: number;
  /** reasoning 的描述 */
    reasoning: string;
  /** alternatives 的描述 */
    alternatives: TreatmentPlan;
  /** risks 的描述 */
    risks: RiskAssessment;
}

// 生活方式建议
export interface ILifestyleRecommendation {
  /** type 的描述 */
    type: string;
  /** goal 的描述 */
    goal: string;
  /** timeline 的描述 */
    timeline: string;
  /** changes 的描述 */
    changes: Array{
    current: string;
    target: string;
    steps: string;
  }>;
  benefits: string[];
  challenges: string[];
}

// 紧急响应
export interface IEmergencyResponse {
  /** severity 的描述 */
    severity: low  moderate  high  critical;
  actions: EmergencyAction;
  recommendations: string;
  warnings: string;
  contacts: string;
}

// 紧急行动
export interface IEmergencyAction {
  /** type 的描述 */
    type: string;
  /** priority 的描述 */
    priority: number;
  /** description 的描述 */
    description: string;
  /** steps 的描述 */
    steps: string;
  /** resources 的描述 */
    resources: string;
}

// AI分析结果
export interface IAIAnalysisResult<T> {
  /** data 的描述 */
    data: T;
  /** confidence 的描述 */
    confidence: number;
  /** explanation 的描述 */
    explanation: string[];
  /** suggestions 的描述 */
    suggestions: string[];
  /** warnings 的描述 */
    warnings: string[];
}

// AI监测规则
export interface IAIMonitoringRule {
  /** metric 的描述 */
    metric: string;
  /** threshold 的描述 */
    threshold: number  /** number 的描述 */
    /** number 的描述 */
    number, /** number 的描述 */
    /** number 的描述 */
    number;
  /** condition 的描述 */
    condition: above  below  between  outside;
  duration: number;
  severity: info  warning  critical;
  actions: string;
}

// AI预测模型
export interface IAIPredictionModel {
  /** type 的描述 */
    type: string;
  /** features 的描述 */
    features: string;
  /** weights 的描述 */
    weights: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
  /** threshold 的描述 */
    threshold: number;
  /** accuracy 的描述 */
    accuracy: number;
  /** lastUpdated 的描述 */
    lastUpdated: Date;
}

// AI学习进度
export interface IAILearningProgress {
  /** modelId 的描述 */
    modelId: string;
  /** iterations 的描述 */
    iterations: number;
  /** accuracy 的描述 */
    accuracy: number;
  /** loss 的描述 */
    loss: number;
  /** improvements 的描述 */
    improvements: string;
  /** timestamp 的描述 */
    timestamp: Date;
}

// AI反馈
export interface IAIFeedback {
  /** userId 的描述 */
    userId: string;
  /** modelId 的描述 */
    modelId: string;
  /** prediction 的描述 */
    prediction: any;
  /** actual 的描述 */
    actual: any;
  /** accuracy 的描述 */
    accuracy: number;
  /** context 的描述 */
    context: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
  /** timestamp 的描述 */
    timestamp: Date;
}
