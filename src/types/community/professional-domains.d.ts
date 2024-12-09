// 中医养生领域
export interface TraditionalMedicineDomain {
  specializations: {
    acupuncture: ExpertiseLevel;
    herbology: ExpertiseLevel;
    massage: ExpertiseLevel;
    qigong: ExpertiseLevel;
  };
  clinicalExperience: {
    caseHistory: CaseRecord[];
    treatmentEfficiency: EfficiencyMetric;
    patientFeedback: Feedback[];
  };
  researchContributions: Research[];
  developmentPath: DevelopmentPath;
}

// 营养健康领域
export interface NutritionHealthDomain {
  dietaryExpertise: {
    mealPlanning: SkillLevel;
    nutritionAnalysis: SkillLevel;
    dietaryGuidance: SkillLevel;
    specialDiets: SkillLevel;
  };
  practicalSkills: {
    consultations: ConsultationRecord[];
    programSuccess: SuccessMetric;
    clientProgress: ProgressMetric[];
  };
  researchWork: Research[];
  careerPath: CareerPath;
}

// 运动康复领域
export interface SportsRehabDomain {
  rehabilitationSkills: {
    injuryAssessment: SkillLevel;
    treatmentPlanning: SkillLevel;
    exerciseTherapy: SkillLevel;
    recoveryManagement: SkillLevel;
  };
  clinicalOutcomes: {
    treatmentSuccess: SuccessRate;
    patientRecovery: RecoveryMetric[];
    followUpResults: FollowUpRecord[];
  };
  professionalDevelopment: Development[];
  specializations: Specialization[];
}

// 心理健康领域
export interface MentalHealthDomain {
  counselingSkills: {
    therapeuticApproaches: SkillLevel;
    crisisIntervention: SkillLevel;
    groupTherapy: SkillLevel;
    assessmentAbility: SkillLevel;
  };
  professionalOutcomes: {
    clientProgress: ProgressMetric[];
    interventionEffectiveness: EffectivenessMetric;
    longTermResults: LongTermOutcome[];
  };
  continuingEducation: Education[];
  specializationPath: SpecializationPath;
} 