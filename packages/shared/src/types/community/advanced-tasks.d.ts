// 专业任务
export interface ProfessionalTasks {
  expertiseTasks: {
    researchArticles: Task[];
    caseStudies: Task[];
    expertReviews: Task[];
  };
  collaborativeTasks: {
    teamProjects: Project[];
    mentorshipPrograms: Program[];
    expertConsultations: Consultation[];
  };
  rewards: ProfessionalReward[];
  expertiseProgress: Progress;
}

// 创新任务
export interface InnovativeTasks {
  creativeProjects: {
    contentInnovations: Project[];
    featureProposals: Proposal[];
    communityInitiatives: Initiative[];
  };
  researchTasks: {
    trendAnalysis: Analysis[];
    userResearch: Research[];
    marketStudies: Study[];
  };
  innovationRewards: InnovationReward[];
  creativeProgress: Progress;
}

// 社区任务
export interface CommunityTasks {
  supportTasks: {
    memberGuidance: Task[];
    problemSolving: Task[];
    communityModeration: Task[];
  };
  organizationalTasks: {
    eventPlanning: Event[];
    communityProjects: Project[];
    qualityControl: Task[];
  };
  communityRewards: CommunityReward[];
  influenceMetrics: Metric[];
}

// 高级认证
export interface AdvancedCertification {
  expertiseStandards: {
    knowledgeDepth: Evaluation;
    practicalExperience: Evaluation;
    professionalAchievements: Achievement[];
  };
  contributionStandards: {
    contentQuality: QualityMetric;
    communityImpact: ImpactMetric;
    innovationLevel: InnovationMetric;
  };
  certificationPath: Path;
  developmentPlan: Plan;
} 