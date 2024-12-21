/**
 * @fileoverview TS 文件 member-analytics.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 行为分析
export interface IBehaviorAnalysis {
  /** usagePatterns 的描述 */
  usagePatterns: {
    featureUsage: IFeatureUsage;
    preferences: IServicePreference;
    interactions: InteractionMetric;
  };
  /** insights 的描述 */
  insights: BehaviorInsight[];
  /** recommendations 的描述 */
  recommendations: Recommendation[];
}

// 健康趋势分析
export interface IHealthTrendAnalysis {
  /** progressTracking 的描述 */
  progressTracking: ProgressMetric;
  /** goalAchievements 的描述 */
  goalAchievements: Achievement;
  /** healthImprovements 的描述 */
  healthImprovements: Improvement;
  /** projections 的描述 */
  projections: HealthProjection;
}

// 保留策略
export interface IRetentionStrategy {
  /** engagementPrograms 的描述 */
  engagementPrograms: {
    campaigns: Campaign;
    promotions: Promotion;
    rewards: Reward;
  };
  /** effectiveness 的描述 */
  effectiveness: EffectivenessMetric[];
  /** timeline 的描述 */
  timeline: ImplementationTimeline;
}

// 流失预防分析
export interface IChurnPreventionAnalysis {
  /** riskLevel 的描述 */
  riskLevel: RiskLevel;
  /** warningSignals 的描述 */
  warningSignals: WarningSignal;
  /** interventionPlan 的描述 */
  interventionPlan: InterventionProgram;
  /** winbackStrategy 的描述 */
  winbackStrategy: WinbackCampaign;
  /** predictedOutcomes 的描述 */
  predictedOutcomes: PredictedOutcome;
}

// 辅助类型定义
export interface IFeatureUsage {
  /** featureId 的描述 */
  featureId: string;
  /** usageFrequency 的描述 */
  usageFrequency: number;
  /** usageDuration 的描述 */
  usageDuration: number;
  /** lastUsed 的描述 */
  lastUsed: Date;
}

export interface IServicePreference {
  /** serviceId 的描述 */
  serviceId: string;
  /** preferenceLevel 的描述 */
  preferenceLevel: number;
  /** usagePattern 的描述 */
  usagePattern: string;
  /** feedback 的描述 */
  feedback: string;
}

export interface InteractionMetric {
  /** type 的描述 */
  type: string;
  /** frequency 的描述 */
  frequency: number;
  /** quality 的描述 */
  quality: number;
  /** engagement 的描述 */
  engagement: number;
}
