/**
 * @fileoverview TS 文件 advanced-assessment.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 多维度评估
export interface IMultiDimensionalAssessment {
  /** professionalDimension 的描述 */
  professionalDimension: {
    expertiseLevel: ExpertiseEvaluation;
    serviceQuality: QualityMetrics;
    innovationCapability: InnovationMetrics;
  };
  /** businessDimension 的描述 */
  businessDimension: {
    marketPerformance: MarketMetrics;
    businessGrowth: GrowthMetrics;
    brandInfluence: BrandMetrics;
  };
  /** developmentTracking 的描述 */
  developmentTracking: DevelopmentMetrics;
  /** comprehensiveScore 的描述 */
  comprehensiveScore: OverallScore;
}

// 晋升评估
export interface IPromotionAssessment {
  /** promotionCriteria 的描述 */
  promotionCriteria: {
    performanceThresholds: ThresholdConfig;
    qualificationRequirements: QualificationConfig;
    achievementMilestones: MilestoneConfig;
  };
  /** assessmentProcess 的描述 */
  assessmentProcess: {
    regularEvaluation: EvaluationPlan;
    specialAssessment: AssessmentPlan;
    feedbackCollection: FeedbackSystem;
  };
  /** promotionTracking 的描述 */
  promotionTracking: ProgressTracking;
  /** careerDevelopment 的描述 */
  careerDevelopment: CareerPath;
}

// 激励体系
export interface IncentiveSystem {
  /** monetaryIncentives 的描述 */
  monetaryIncentives: {
    commissionStructure: ICommissionConfig;
    performanceBonus: BonusSystem;
    specialRewards: RewardProgram;
  };
  /** nonMonetaryIncentives 的描述 */
  nonMonetaryIncentives: {
    recognitionPrograms: RecognitionSystem;
    developmentOpportunities: OpportunityProgram;
    exclusiveBenefits: BenefitPackage;
  };
  /** incentiveTracking 的描述 */
  incentiveTracking: TrackingMetrics;
  /** motivationAnalysis 的描述 */
  motivationAnalysis: MotivationReport;
}

// 高级分析
export interface IAdvancedAnalytics {
  /** performanceAnalytics 的描述 */
  performanceAnalytics: {
    trendAnalysis: TrendReport;
    predictiveModeling: PredictiveModel;
    benchmarkComparison: BenchmarkReport;
  };
  /** businessInsights 的描述 */
  businessInsights: {
    marketOpportunities: OpportunityAnalysis;
    competitiveAnalysis: CompetitiveReport;
    growthPotential: GrowthAnalysis;
  };
  /** dataVisualization 的描述 */
  dataVisualization: Dashboard[];
  /** actionableRecommendations 的描述 */
  actionableRecommendations: Recommendation[];
}
