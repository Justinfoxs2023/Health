/**
 * @fileoverview TS 文件 advanced-dimensions.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 生活方式分析
export interface ILifestyleAnalysis {
  /** exerciseAnalysis 的描述 */
  exerciseAnalysis: {
    frequency: number;
    intensity: number;
    duration: number;
    types: string;
  };
  /** dietaryAnalysis 的描述 */
  dietaryAnalysis: {
    nutritionBalance: number;
    mealPatterns: string[];
    preferences: string[];
    restrictions: string[];
  };
  /** sleepAnalysis 的描述 */
  sleepAnalysis: {
    quality: number;
    duration: number;
    patterns: string[];
    disturbances: string[];
  };
  /** recommendations 的描述 */
  recommendations: LifestyleRecommendation[];
}

// 社交互动分析
export interface ISocialInteractionAnalysis {
  /** communityMetrics 的描述 */
  communityMetrics: {
    participation: number;
    influence: number;
    connections: number;
  };
  /** expertInteractionMetrics 的描述 */
  expertInteractionMetrics: {
    frequency: number;
    quality: number;
    feedback: string[];
  };
  /** eventMetrics 的描述 */
  eventMetrics: {
    attendance: number;
    engagement: number;
    feedback: string[];
  };
  /** socialScore 的描述 */
  socialScore: number;
}

// 心理健康分析
export interface IMentalWellbeingAnalysis {
  /** stressAnalysis 的描述 */
  stressAnalysis: {
    level: number;
    triggers: string;
    copingMechanisms: string;
  };
  /** emotionalAnalysis 的描述 */
  emotionalAnalysis: {
    states: EmotionalState[];
    patterns: string[];
    stability: number;
  };
  /** resilienceScore 的描述 */
  resilienceScore: number;
  /** supportRecommendations 的描述 */
  supportRecommendations: SupportRecommendation[];
}

// 健康风险预测
export interface IHealthRiskPrediction {
  /** riskFactors 的描述 */
  riskFactors: RiskFactor;
  /** riskLevel 的描述 */
  riskLevel: {
    current: number;
    projected: number;
    trend: string;
  };
  /** preventiveMeasures 的描述 */
  preventiveMeasures: PreventiveMeasure[];
  /** monitoringPlan 的描述 */
  monitoringPlan: MonitoringPlan;
}
