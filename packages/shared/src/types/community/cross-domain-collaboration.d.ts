/**
 * @fileoverview TS 文件 cross-domain-collaboration.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 整合医疗方案
export interface IntegratedTreatment {
  /** treatmentPlans 的描述 */
  treatmentPlans: {
    tcmIntegration: TreatmentPlan;
    nutritionPlanning: NutritionPlan;
    rehabPrograms: RehabPlan;
    mentalHealthSupport: MentalHealthPlan;
  };
  /** collaborativeOutcomes 的描述 */
  collaborativeOutcomes: {
    treatmentEffectiveness: EffectivenessMetric;
    patientSatisfaction: SatisfactionMetric;
    recoveryMetrics: RecoveryMetric[];
  };
  /** crossDisciplinaryTeam 的描述 */
  crossDisciplinaryTeam: TeamMember[];
  /** integratedResearch 的描述 */
  integratedResearch: ResearchProject[];
}

// 跨领域研究
export interface ICrossDomainResearch {
  /** researchProjects 的描述 */
  researchProjects: {
    integrativeMedicine: Project[];
    lifestyleIntervention: Project[];
    preventiveCare: Project[];
    holisticHealth: Project[];
  };
  /** collaborations 的描述 */
  collaborations: {
    academicPartners: Partner[];
    clinicalTrials: Trial[];
    communityPrograms: Program[];
  };
  /** publications 的描述 */
  publications: Publication[];
  /** impactMetrics 的描述 */
  impactMetrics: ImpactMetric[];
}

// 专业发展
export interface IProfessionalDevelopment {
  /** skillDevelopment 的描述 */
  skillDevelopment: {
    coreProficiency: ProficiencyLevel;
    interdisciplinarySkills: SkillSet[];
    leadershipAbilities: LeadershipSkill[];
    researchCapabilities: ResearchSkill[];
  };
  /** careerProgression 的描述 */
  careerProgression: {
    currentLevel: Level;
    nextMilestones: Milestone[];
    longTermGoals: Goal[];
  };
  /** mentorshipProgram 的描述 */
  mentorshipProgram: MentorshipDetails;
  /** certifications 的描述 */
  certifications: Certification[];
}

// 社区教育
export interface ICommunityEducation {
  /** educationalPrograms 的描述 */
  educationalPrograms: {
    publicWorkshops: Workshop[];
    professionalTraining: Training[];
    onlineCourses: Course[];
    communityOutreach: OutreachProgram[];
  };
  /** programMetrics 的描述 */
  programMetrics: {
    participantEngagement: EngagementMetric;
    learningOutcomes: OutcomeMetric[];
    communityImpact: ImpactMetric;
  };
  /** resourceDevelopment 的描述 */
  resourceDevelopment: Resource[];
  /** qualityAssurance 的描述 */
  qualityAssurance: QualityMetric[];
}
