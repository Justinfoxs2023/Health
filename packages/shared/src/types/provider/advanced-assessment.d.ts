// 多维度评估
export interface MultiDimensionalAssessment {
  professionalDimension: {
    expertiseLevel: ExpertiseEvaluation;
    serviceQuality: QualityMetrics;
    innovationCapability: InnovationMetrics;
  };
  businessDimension: {
    marketPerformance: MarketMetrics;
    businessGrowth: GrowthMetrics;
    brandInfluence: BrandMetrics;
  };
  developmentTracking: DevelopmentMetrics;
  comprehensiveScore: OverallScore;
}

// 晋升评估
export interface PromotionAssessment {
  promotionCriteria: {
    performanceThresholds: ThresholdConfig;
    qualificationRequirements: QualificationConfig;
    achievementMilestones: MilestoneConfig;
  };
  assessmentProcess: {
    regularEvaluation: EvaluationPlan;
    specialAssessment: AssessmentPlan;
    feedbackCollection: FeedbackSystem;
  };
  promotionTracking: ProgressTracking;
  careerDevelopment: CareerPath;
}

// 激励体系
export interface IncentiveSystem {
  monetaryIncentives: {
    commissionStructure: CommissionConfig;
    performanceBonus: BonusSystem;
    specialRewards: RewardProgram;
  };
  nonMonetaryIncentives: {
    recognitionPrograms: RecognitionSystem;
    developmentOpportunities: OpportunityProgram;
    exclusiveBenefits: BenefitPackage;
  };
  incentiveTracking: TrackingMetrics;
  motivationAnalysis: MotivationReport;
}

// 高级分析
export interface AdvancedAnalytics {
  performanceAnalytics: {
    trendAnalysis: TrendReport;
    predictiveModeling: PredictiveModel;
    benchmarkComparison: BenchmarkReport;
  };
  businessInsights: {
    marketOpportunities: OpportunityAnalysis;
    competitiveAnalysis: CompetitiveReport;
    growthPotential: GrowthAnalysis;
  };
  dataVisualization: Dashboard[];
  actionableRecommendations: Recommendation[];
} 