// 认证服务商
export interface CertifiedProvider {
  certificationRequirements: {
    qualification: QualificationVerification;
    experience: ExperienceVerification;
    training: TrainingCertification;
  };
  servicePrivileges: {
    basicServices: ServicePermission;
    trafficSupport: TrafficAllocation;
    operationalSupport: SupportService;
  };
  performanceTracking: PerformanceMetrics;
  developmentPath: DevelopmentPlan;
}

// 金牌服务商
export interface GoldProvider {
  advancedRequirements: {
    qualification: AdvancedQualification;
    experience: ExtensiveExperience;
    performance: PerformanceMetrics;
  };
  enhancedPrivileges: {
    priorityTraffic: TrafficPriority;
    operationalSupport: EnhancedSupport;
    brandPromotion: PromotionPlan;
  };
  performanceAnalytics: AnalyticsReport;
  growthOpportunities: GrowthPlan;
}

// 战略合作伙伴
export interface StrategicPartner {
  eliteRequirements: {
    qualification: EliteQualification;
    experience: PremiumExperience;
    performance: ElitePerformance;
  };
  strategicBenefits: {
    businessCollaboration: CollaborationPlan;
    resourcePriority: ResourceAllocation;
    brandPartnership: PartnershipProgram;
  };
  marketAnalytics: MarketReport;
  developmentStrategy: StrategicPlan;
}

// 服务能力
export interface ServiceCapability {
  serviceMetrics: {
    qualityIndicators: QualityMetric[];
    capacityMetrics: CapacityMetric[];
    reliabilityScores: ReliabilityScore[];
  };
  competencyAnalysis: {
    technicalSkills: SkillAssessment;
    serviceManagement: ManagementMetric;
    innovationCapability: InnovationMetric;
  };
  performanceReports: Report[];
  improvementSuggestions: Suggestion[];
} 