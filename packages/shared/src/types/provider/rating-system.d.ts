// 评分维度
export interface RatingDimensions {
  serviceQuality: {
    professionalSkill: SkillEvaluation;
    serviceAttitude: AttitudeEvaluation;
    treatmentEffect: EffectEvaluation;
  };
  userExperience: {
    appointmentConvenience: ConvenienceMetric;
    serviceProcess: ProcessMetric;
    environmentComfort: ComfortMetric;
  };
  overallRating: RatingMetric;
  ratingTrends: TrendAnalysis;
}

// 评价收集
export interface FeedbackCollection {
  feedbackChannels: {
    serviceReview: ReviewSystem;
    satisfactionSurvey: SurveySystem;
    complaintSystem: ComplaintSystem;
  };
  feedbackValidation: ValidationConfig;
  responseManagement: ResponseSystem;
  improvementTracking: TrackingSystem;
}

// 评分影响
export interface RatingImpact {
  rankingInfluence: {
    searchRanking: RankingConfig;
    recommendationPriority: PriorityConfig;
    businessOpportunities: OpportunityConfig;
  };
  servicePrivileges: {
    platformSupport: SupportConfig;
    resourceAccess: AccessConfig;
    growthOpportunities: OpportunityConfig;
  };
  reputationSystem: ReputationConfig;
  correctionMechanism: CorrectionConfig;
}

// 评分优化
export interface RatingOptimization {
  improvementSuggestions: {
    serviceQualityTips: QualityTips;
    userExperienceTips: ExperienceTips;
    professionalDevelopment: DevelopmentPlan;
  };
  performanceAnalysis: {
    strengthAnalysis: StrengthAnalysis;
    weaknessAnalysis: WeaknessAnalysis;
    opportunityAnalysis: OpportunityAnalysis;
  };
  actionPlans: ActionPlan[];
  progressTracking: TrackingConfig;
} 