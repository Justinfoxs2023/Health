/**
 * @fileoverview TS 文件 professional-domains.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 中医养生领域
export interface ITraditionalMedicineDomain {
  /** specializations 的描述 */
  specializations: {
    acupuncture: ExpertiseLevel;
    herbology: ExpertiseLevel;
    massage: ExpertiseLevel;
    qigong: ExpertiseLevel;
  };
  /** clinicalExperience 的描述 */
  clinicalExperience: {
    caseHistory: CaseRecord[];
    treatmentEfficiency: EfficiencyMetric;
    patientFeedback: Feedback[];
  };
  /** researchContributions 的描述 */
  researchContributions: Research[];
  /** developmentPath 的描述 */
  developmentPath: DevelopmentPath;
}

// 营养健康领域
export interface INutritionHealthDomain {
  /** dietaryExpertise 的描述 */
  dietaryExpertise: {
    mealPlanning: SkillLevel;
    nutritionAnalysis: SkillLevel;
    dietaryGuidance: SkillLevel;
    specialDiets: SkillLevel;
  };
  /** practicalSkills 的描述 */
  practicalSkills: {
    consultations: ConsultationRecord[];
    programSuccess: SuccessMetric;
    clientProgress: ProgressMetric[];
  };
  /** researchWork 的描述 */
  researchWork: Research[];
  /** careerPath 的描述 */
  careerPath: CareerPath;
}

// 运动康复领域
export interface ISportsRehabDomain {
  /** rehabilitationSkills 的描述 */
  rehabilitationSkills: {
    injuryAssessment: SkillLevel;
    treatmentPlanning: SkillLevel;
    exerciseTherapy: SkillLevel;
    recoveryManagement: SkillLevel;
  };
  /** clinicalOutcomes 的描述 */
  clinicalOutcomes: {
    treatmentSuccess: SuccessRate;
    patientRecovery: RecoveryMetric[];
    followUpResults: FollowUpRecord[];
  };
  /** professionalDevelopment 的描述 */
  professionalDevelopment: Development[];
  /** specializations 的描述 */
  specializations: Specialization[];
}

// 心理健康领域
export interface IMentalHealthDomain {
  /** counselingSkills 的描述 */
  counselingSkills: {
    therapeuticApproaches: SkillLevel;
    crisisIntervention: SkillLevel;
    groupTherapy: SkillLevel;
    assessmentAbility: SkillLevel;
  };
  /** professionalOutcomes 的描述 */
  professionalOutcomes: {
    clientProgress: ProgressMetric[];
    interventionEffectiveness: EffectivenessMetric;
    longTermResults: LongTermOutcome[];
  };
  /** continuingEducation 的描述 */
  continuingEducation: Education[];
  /** specializationPath 的描述 */
  specializationPath: SpecializationPath;
}
