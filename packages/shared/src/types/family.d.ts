/**
 * @fileoverview TS 文件 family.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare namespace Family {
  interface DiseaseHistory {
    memberId: string;
    relationship: string;
    diseases: {
      name: string;
      diagnosisAge: number;
      severity: 'mild' | 'moderate' | 'severe';
    }[];
  }

  interface DiseaseRisk {
    disease: string;
    riskLevel: 'low' | 'medium' | 'high';
    contributingFactors: string[];
    preventiveMeasures: {
      action: string;
      timeline: string;
      priority: number;
    }[];
  }

  interface TimelineEvent {
    date: string;
    action: string;
    status: 'pending' | 'completed' | 'overdue';
    priority: number;
  }
}
