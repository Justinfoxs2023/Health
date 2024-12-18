/**
 * @fileoverview TS 文件 genetic-risk.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 遗传风险评估模型
export interface IGeneticRiskModel {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;

   
  /** familyHistory 的描述 */
    familyHistory: {
    diseases: IFamilyDiseaseHistory;
    relationships: FamilyRelationship;
    riskFactors: IGeneticRiskFactor;
  };

  // 遗传风险评估
  /** riskAssessment 的描述 */
    riskAssessment: {
    primaryRisks: IDiseaseRisk[];
    secondaryRisks: IDiseaseRisk[];
    environmentalFactors: EnvironmentalFactor[];
    lifestyleFactors: LifestyleFactor[];
  };

  // 预防建议
  /** preventiveActions 的描述 */
    preventiveActions: {
    screeningSchedule: ScreeningPlan[];
    lifestyleRecommendations: LifestyleRecommendation[];
    monitoringMetrics: HealthMetric[];
  };
}

// 家族疾病史
export interface IFamilyDiseaseHistory {
  /** diseaseType 的描述 */
    diseaseType: string;
  /** relationship 的描述 */
    relationship: FamilyRelationship;
  /** onsetAge 的描述 */
    onsetAge: number;
  /** status 的描述 */
    status: active  managed  resolved;
  severity: mild  moderate  severe;
  geneticTesting: GeneticTestResult;
}

// 遗传风险因素
export interface IGeneticRiskFactor {
  /** factor 的描述 */
    factor: string;
  /** riskLevel 的描述 */
    riskLevel: low  moderate  high;
  inheritancePattern: string;
  relatedDiseases: string;
  preventiveMeasures: string;
}

// 疾病风险评估
export interface IDiseaseRisk {
  /** disease 的描述 */
    disease: string;
  /** riskLevel 的描述 */
    riskLevel: number;  /** 0100 的描述 */
    /** 0100 的描述 */
    0100
  /** contributingFactors 的描述 */
    contributingFactors: string;
  /** preventability 的描述 */
    preventability: number;  /** 0100 的描述 */
    /** 0100 的描述 */
    0100
  /** recommendedActions 的描述 */
    recommendedActions: PreventiveAction;
  /** monitoringPlan 的描述 */
    monitoringPlan: MonitoringPlan;
}
