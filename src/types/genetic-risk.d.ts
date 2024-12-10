// 遗传风险评估模型
export interface GeneticRiskModel {
  id: string;
  userId: string;
  
  // 家族病史
  familyHistory: {
    diseases: FamilyDiseaseHistory[];
    relationships: FamilyRelationship[];
    riskFactors: GeneticRiskFactor[];
  };
  
  // 遗传风险评估
  riskAssessment: {
    primaryRisks: DiseaseRisk[];
    secondaryRisks: DiseaseRisk[];
    environmentalFactors: EnvironmentalFactor[];
    lifestyleFactors: LifestyleFactor[];
  };
  
  // 预防建议
  preventiveActions: {
    screeningSchedule: ScreeningPlan[];
    lifestyleRecommendations: LifestyleRecommendation[];
    monitoringMetrics: HealthMetric[];
  };
}

// 家族疾病史
export interface FamilyDiseaseHistory {
  diseaseType: string;
  relationship: FamilyRelationship;
  onsetAge: number;
  status: 'active' | 'managed' | 'resolved';
  severity: 'mild' | 'moderate' | 'severe';
  geneticTesting?: GeneticTestResult;
}

// 遗传风险因素
export interface GeneticRiskFactor {
  factor: string;
  riskLevel: 'low' | 'moderate' | 'high';
  inheritancePattern: string;
  relatedDiseases: string[];
  preventiveMeasures: string[];
}

// 疾病风险评估
export interface DiseaseRisk {
  disease: string;
  riskLevel: number; // 0-100
  contributingFactors: string[];
  preventability: number; // 0-100
  recommendedActions: PreventiveAction[];
  monitoringPlan: MonitoringPlan;
} 