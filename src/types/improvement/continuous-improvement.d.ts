// 服务优化
export interface ServiceOptimization {
  dataAnalysis: {
    userFeedbackAnalysis: FeedbackAnalytics;
    serviceMetricsAnalysis: MetricsAnalytics;
    marketTrendAnalysis: TrendAnalytics;
  };
  improvementActions: {
    processOptimization: ProcessConfig;
    qualityEnhancement: QualityConfig;
    innovationPromotion: InnovationConfig;
  };
  optimizationMetrics: MetricConfig;
  improvementReporting: ReportingConfig;
}

// 培训系统
export interface TrainingSystem {
  regularTraining: {
    professionalSkills: SkillsTraining;
    serviceStandards: StandardsTraining;
    industryKnowledge: KnowledgeTraining;
  };
  specialPrograms: {
    leadershipDevelopment: LeadershipProgram;
    innovationWorkshop: WorkshopConfig;
    crisisManagement: CrisisTraining;
  };
  trainingEffectiveness: EffectivenessMetric;
  developmentTracking: DevelopmentMetric;
}

// 改进评估
export interface ImprovementEvaluation {
  performanceMetrics: {
    serviceQuality: QualityMetric;
    operationalEfficiency: EfficiencyMetric;
    userSatisfaction: SatisfactionMetric;
  };
  developmentProgress: {
    skillsGrowth: GrowthMetric;
    competencyImprovement: ImprovementMetric;
    innovationCapability: CapabilityMetric;
  };
  impactAnalysis: ImpactReport;
  recommendedActions: ActionPlan[];
} 