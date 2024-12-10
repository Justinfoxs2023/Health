// 养生保健领域
export interface WellnessDomain {
  specializedAreas: {
    meditation: PracticeLevel;
    breathwork: PracticeLevel;
    energyHealing: PracticeLevel;
    mindBodyPractices: PracticeLevel;
  };
  wellnessPrograms: {
    stressManagement: Program[];
    lifestyleOptimization: Program[];
    preventiveCare: Program[];
  };
  practitionerNetwork: Practitioner[];
  wellnessMetrics: WellnessMetric[];
}

// 跨文化医疗
export interface CrossculturalMedicine {
  culturalPractices: {
    traditionalMedicine: Practice[];
    modernApproaches: Approach[];
    culturalAdaptation: Adaptation[];
  };
  integrationPrograms: {
    culturalTraining: Training[];
    practiceGuidelines: Guideline[];
    communityEngagement: Engagement[];
  };
  researchInitiatives: Initiative[];
  effectivenessMetrics: EffectivenessMetric[];
}

// 数字健康创新
export interface DigitalHealthDomain {
  digitalSolutions: {
    telehealth: Solution[];
    mobileHealth: Application[];
    aiAssistance: Tool[];
    dataAnalytics: Analytics[];
  };
  innovationProjects: {
    platformDevelopment: Project[];
    userExperience: UXImprovement[];
    dataIntegration: Integration[];
  };
  techImplementation: Implementation[];
  adoptionMetrics: AdoptionMetric[];
}

// 社区健康生态
export interface CommunityEcology {
  ecosystemDevelopment: {
    healthNetworks: Network[];
    resourceAllocation: Resource[];
    sustainableGrowth: GrowthPlan[];
  };
  communityPrograms: {
    healthEducation: Program[];
    preventiveServices: Service[];
    supportGroups: Group[];
  };
  impactAssessment: Assessment[];
  sustainabilityMetrics: SustainabilityMetric[];
} 