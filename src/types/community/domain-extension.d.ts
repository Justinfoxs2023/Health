/**
 * @fileoverview TS 文件 domain-extension.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 养生保健领域
export interface IWellnessDomain {
  /** specializedAreas 的描述 */
  specializedAreas: {
    meditation: PracticeLevel;
    breathwork: PracticeLevel;
    energyHealing: PracticeLevel;
    mindBodyPractices: PracticeLevel;
  };
  /** wellnessPrograms 的描述 */
  wellnessPrograms: {
    stressManagement: Program[];
    lifestyleOptimization: Program[];
    preventiveCare: Program[];
  };
  /** practitionerNetwork 的描述 */
  practitionerNetwork: Practitioner[];
  /** wellnessMetrics 的描述 */
  wellnessMetrics: WellnessMetric[];
}

// 跨文化医疗
export interface ICrossculturalMedicine {
  /** culturalPractices 的描述 */
  culturalPractices: {
    traditionalMedicine: Practice;
    modernApproaches: Approach;
    culturalAdaptation: Adaptation;
  };
  /** integrationPrograms 的描述 */
  integrationPrograms: {
    culturalTraining: Training[];
    practiceGuidelines: Guideline[];
    communityEngagement: Engagement[];
  };
  /** researchInitiatives 的描述 */
  researchInitiatives: Initiative[];
  /** effectivenessMetrics 的描述 */
  effectivenessMetrics: EffectivenessMetric[];
}

// 数字健康创新
export interface IDigitalHealthDomain {
  /** digitalSolutions 的描述 */
  digitalSolutions: {
    telehealth: Solution;
    mobileHealth: Application;
    aiAssistance: Tool;
    dataAnalytics: Analytics;
  };
  /** innovationProjects 的描述 */
  innovationProjects: {
    platformDevelopment: Project[];
    userExperience: UXImprovement[];
    dataIntegration: Integration[];
  };
  /** techImplementation 的描述 */
  techImplementation: Implementation[];
  /** adoptionMetrics 的描述 */
  adoptionMetrics: AdoptionMetric[];
}

// 社区健康生态
export interface ICommunityEcology {
  /** ecosystemDevelopment 的描述 */
  ecosystemDevelopment: {
    healthNetworks: Network;
    resourceAllocation: Resource;
    sustainableGrowth: GrowthPlan;
  };
  /** communityPrograms 的描述 */
  communityPrograms: {
    healthEducation: Program[];
    preventiveServices: Service[];
    supportGroups: Group[];
  };
  /** impactAssessment 的描述 */
  impactAssessment: Assessment[];
  /** sustainabilityMetrics 的描述 */
  sustainabilityMetrics: SustainabilityMetric[];
}
