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
      severity: mild  moderate  severe;
    }[];
  }

  interface IDiseaseRisk {
    /** disease 的描述 */
      disease: string;
    /** riskLevel 的描述 */
      riskLevel: low  medium  high;
    contributingFactors: string;
    preventiveMeasures: {
      action: string;
      timeline: string;
      priority: number;
    }[];
  }

  interface ITimelineEvent {
    /** date 的描述 */
      date: string;
    /** action 的描述 */
      action: string;
    /** status 的描述 */
      status: pending  completed  overdue;
    priority: number;
  }
}
