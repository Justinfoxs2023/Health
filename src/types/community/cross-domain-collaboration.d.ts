// 整合医疗方案
export interface IntegratedTreatment {
  treatmentPlans: {
    tcmIntegration: TreatmentPlan;
    nutritionPlanning: NutritionPlan;
    rehabPrograms: RehabPlan;
    mentalHealthSupport: MentalHealthPlan;
  };
  collaborativeOutcomes: {
    treatmentEffectiveness: EffectivenessMetric;
    patientSatisfaction: SatisfactionMetric;
    recoveryMetrics: RecoveryMetric[];
  };
  crossDisciplinaryTeam: TeamMember[];
  integratedResearch: ResearchProject[];
}

// 跨领域研究
export interface CrossDomainResearch {
  researchProjects: {
    integrativeMedicine: Project[];
    lifestyleIntervention: Project[];
    preventiveCare: Project[];
    holisticHealth: Project[];
  };
  collaborations: {
    academicPartners: Partner[];
    clinicalTrials: Trial[];
    communityPrograms: Program[];
  };
  publications: Publication[];
  impactMetrics: ImpactMetric[];
}

// 专业发展
export interface ProfessionalDevelopment {
  skillDevelopment: {
    coreProficiency: ProficiencyLevel;
    interdisciplinarySkills: SkillSet[];
    leadershipAbilities: LeadershipSkill[];
    researchCapabilities: ResearchSkill[];
  };
  careerProgression: {
    currentLevel: Level;
    nextMilestones: Milestone[];
    longTermGoals: Goal[];
  };
  mentorshipProgram: MentorshipDetails;
  certifications: Certification[];
}

// 社区教育
export interface CommunityEducation {
  educationalPrograms: {
    publicWorkshops: Workshop[];
    professionalTraining: Training[];
    onlineCourses: Course[];
    communityOutreach: OutreachProgram[];
  };
  programMetrics: {
    participantEngagement: EngagementMetric;
    learningOutcomes: OutcomeMetric[];
    communityImpact: ImpactMetric;
  };
  resourceDevelopment: Resource[];
  qualityAssurance: QualityMetric[];
} 