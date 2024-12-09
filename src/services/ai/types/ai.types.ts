import { BaseHealthData } from '../../health/types/health-base.types';

// AI模型配置
export interface AIModelConfig {
  modelType: 'diagnosis' | 'prediction' | 'recommendation';
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
export interface AICapability {
  name: string;
  description: string;
  accuracy: number;
  requirements: string[];
  limitations: string[];
}

// 健康风险分析
export interface HealthRiskAnalysis {
  risks: RiskAssessment[];
  predictions: RiskPrediction[];
  confidence: number;
  reasoning: string[];
  alternatives: RiskPrediction[];
}

// 治疗方案分析
export interface TreatmentAnalysis {
  bestOption: TreatmentPlan;
  confidence: number;
  reasoning: string[];
  alternatives: TreatmentPlan[];
  risks: RiskAssessment[];
}

// 生活方式建议
export interface LifestyleRecommendation {
  type: string;
  goal: string;
  timeline: string;
  changes: Array<{
    current: string;
    target: string;
    steps: string[];
  }>;
  benefits: string[];
  challenges: string[];
}

// 紧急响应
export interface EmergencyResponse {
  severity: 'low' | 'moderate' | 'high' | 'critical';
  actions: EmergencyAction[];
  recommendations: string[];
  warnings: string[];
  contacts: string[];
}

// 紧急行动
export interface EmergencyAction {
  type: string;
  priority: number;
  description: string;
  steps: string[];
  resources: string[];
}

// AI分析结果
export interface AIAnalysisResult<T> {
  data: T;
  confidence: number;
  explanation: string[];
  suggestions: string[];
  warnings: string[];
}

// AI监测规则
export interface AIMonitoringRule {
  metric: string;
  threshold: number | [number, number];
  condition: 'above' | 'below' | 'between' | 'outside';
  duration: number;
  severity: 'info' | 'warning' | 'critical';
  actions: string[];
}

// AI预测模型
export interface AIPredictionModel {
  type: string;
  features: string[];
  weights: Record<string, number>;
  threshold: number;
  accuracy: number;
  lastUpdated: Date;
}

// AI学习进度
export interface AILearningProgress {
  modelId: string;
  iterations: number;
  accuracy: number;
  loss: number;
  improvements: string[];
  timestamp: Date;
}

// AI反馈
export interface AIFeedback {
  userId: string;
  modelId: string;
  prediction: any;
  actual: any;
  accuracy: number;
  context: Record<string, any>;
  timestamp: Date;
} 