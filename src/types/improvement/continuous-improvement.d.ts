/**
 * @fileoverview TS 文件 continuous-improvement.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 服务优化
export interface IServiceOptimization {
  /** dataAnalysis 的描述 */
  dataAnalysis: {
    userFeedbackAnalysis: FeedbackAnalytics;
    serviceMetricsAnalysis: MetricsAnalytics;
    marketTrendAnalysis: TrendAnalytics;
  };
  /** improvementActions 的描述 */
  improvementActions: {
    processOptimization: ProcessConfig;
    qualityEnhancement: QualityConfig;
    innovationPromotion: InnovationConfig;
  };
  /** optimizationMetrics 的描述 */
  optimizationMetrics: MetricConfig;
  /** improvementReporting 的描述 */
  improvementReporting: ReportingConfig;
}

// 培训系统
export interface ITrainingSystem {
  /** regularTraining 的描述 */
  regularTraining: {
    professionalSkills: SkillsTraining;
    serviceStandards: StandardsTraining;
    industryKnowledge: KnowledgeTraining;
  };
  /** specialPrograms 的描述 */
  specialPrograms: {
    leadershipDevelopment: LeadershipProgram;
    innovationWorkshop: WorkshopConfig;
    crisisManagement: CrisisTraining;
  };
  /** trainingEffectiveness 的描述 */
  trainingEffectiveness: EffectivenessMetric;
  /** developmentTracking 的描述 */
  developmentTracking: DevelopmentMetric;
}

// 改进评估
export interface ImprovementEvaluation {
  /** performanceMetrics 的描述 */
  performanceMetrics: {
    serviceQuality: QualityMetric;
    operationalEfficiency: EfficiencyMetric;
    userSatisfaction: SatisfactionMetric;
  };
  /** developmentProgress 的描述 */
  developmentProgress: {
    skillsGrowth: GrowthMetric;
    competencyImprovement: ImprovementMetric;
    innovationCapability: CapabilityMetric;
  };
  /** impactAnalysis 的描述 */
  impactAnalysis: ImpactReport;
  /** recommendedActions 的描述 */
  recommendedActions: ActionPlan[];
}
