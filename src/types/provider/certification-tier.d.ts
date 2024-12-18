/**
 * @fileoverview TS 文件 certification-tier.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 认证服务商
export interface ICertifiedProvider {
  /** certificationRequirements 的描述 */
  certificationRequirements: {
    qualification: QualificationVerification;
    experience: ExperienceVerification;
    training: TrainingCertification;
  };
  /** servicePrivileges 的描述 */
  servicePrivileges: {
    basicServices: ServicePermission;
    trafficSupport: TrafficAllocation;
    operationalSupport: SupportService;
  };
  /** performanceTracking 的描述 */
  performanceTracking: IPerformanceMetrics;
  /** developmentPath 的描述 */
  developmentPath: DevelopmentPlan;
}

// 金牌服务商
export interface IGoldProvider {
  /** advancedRequirements 的描述 */
  advancedRequirements: {
    qualification: AdvancedQualification;
    experience: ExtensiveExperience;
    performance: IPerformanceMetrics;
  };
  /** enhancedPrivileges 的描述 */
  enhancedPrivileges: {
    priorityTraffic: TrafficPriority;
    operationalSupport: EnhancedSupport;
    brandPromotion: PromotionPlan;
  };
  /** performanceAnalytics 的描述 */
  performanceAnalytics: AnalyticsReport;
  /** growthOpportunities 的描述 */
  growthOpportunities: GrowthPlan;
}

// 战略合作伙伴
export interface IStrategicPartner {
  /** eliteRequirements 的描述 */
  eliteRequirements: {
    qualification: EliteQualification;
    experience: PremiumExperience;
    performance: ElitePerformance;
  };
  /** strategicBenefits 的描述 */
  strategicBenefits: {
    businessCollaboration: CollaborationPlan;
    resourcePriority: ResourceAllocation;
    brandPartnership: PartnershipProgram;
  };
  /** marketAnalytics 的描述 */
  marketAnalytics: MarketReport;
  /** developmentStrategy 的描述 */
  developmentStrategy: StrategicPlan;
}

// 服务能力
export interface IServiceCapability {
  /** serviceMetrics 的描述 */
  serviceMetrics: {
    qualityIndicators: QualityMetric;
    capacityMetrics: CapacityMetric;
    reliabilityScores: ReliabilityScore;
  };
  /** competencyAnalysis 的描述 */
  competencyAnalysis: {
    technicalSkills: SkillAssessment;
    serviceManagement: ManagementMetric;
    innovationCapability: InnovationMetric;
  };
  /** performanceReports 的描述 */
  performanceReports: Report[];
  /** improvementSuggestions 的描述 */
  improvementSuggestions: Suggestion[];
}
