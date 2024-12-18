/**
 * @fileoverview TS 文件 rating-system.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 评分维度
export interface IRatingDimensions {
  /** serviceQuality 的描述 */
  serviceQuality: {
    professionalSkill: SkillEvaluation;
    serviceAttitude: AttitudeEvaluation;
    treatmentEffect: EffectEvaluation;
  };
  /** userExperience 的描述 */
  userExperience: {
    appointmentConvenience: ConvenienceMetric;
    serviceProcess: ProcessMetric;
    environmentComfort: ComfortMetric;
  };
  /** overallRating 的描述 */
  overallRating: RatingMetric;
  /** ratingTrends 的描述 */
  ratingTrends: TrendAnalysis;
}

// 评价收集
export interface IFeedbackCollection {
  /** feedbackChannels 的描述 */
  feedbackChannels: {
    serviceReview: ReviewSystem;
    satisfactionSurvey: SurveySystem;
    complaintSystem: ComplaintSystem;
  };
  /** feedbackValidation 的描述 */
  feedbackValidation: ValidationConfig;
  /** responseManagement 的描述 */
  responseManagement: ResponseSystem;
  /** improvementTracking 的描述 */
  improvementTracking: TrackingSystem;
}

// 评分影响
export interface IRatingImpact {
  /** rankingInfluence 的描述 */
  rankingInfluence: {
    searchRanking: RankingConfig;
    recommendationPriority: PriorityConfig;
    businessOpportunities: OpportunityConfig;
  };
  /** servicePrivileges 的描述 */
  servicePrivileges: {
    platformSupport: SupportConfig;
    resourceAccess: AccessConfig;
    growthOpportunities: OpportunityConfig;
  };
  /** reputationSystem 的描述 */
  reputationSystem: ReputationConfig;
  /** correctionMechanism 的描述 */
  correctionMechanism: CorrectionConfig;
}

// 评分优化
export interface IRatingOptimization {
  /** improvementSuggestions 的描述 */
  improvementSuggestions: {
    serviceQualityTips: QualityTips;
    userExperienceTips: ExperienceTips;
    professionalDevelopment: DevelopmentPlan;
  };
  /** performanceAnalysis 的描述 */
  performanceAnalysis: {
    strengthAnalysis: StrengthAnalysis;
    weaknessAnalysis: WeaknessAnalysis;
    opportunityAnalysis: OpportunityAnalysis;
  };
  /** actionPlans 的描述 */
  actionPlans: ActionPlan[];
  /** progressTracking 的描述 */
  progressTracking: TrackingConfig;
}
