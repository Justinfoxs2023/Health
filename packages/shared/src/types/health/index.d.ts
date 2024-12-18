/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 健康数据类型
export interface IHealthData {
  /** vitalSigns 的描述 */
  vitalSigns: IVitalSigns;
  /** activities 的描述 */
  activities: Activity[];
  /** sleep 的描述 */
  sleep: SleepData;
  /** nutrition 的描述 */
  nutrition: NutritionData;
  /** mentalHealth 的描述 */
  mentalHealth: MentalHealthData;
}

// 生命体征
export interface IVitalSigns {
  /** heartRate 的描述 */
  heartRate: number;
  /** bloodPressure 的描述 */
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  /** bloodOxygen 的描述 */
  bloodOxygen: number;
  /** temperature 的描述 */
  temperature: number;
  /** respiratoryRate 的描述 */
  respiratoryRate: number;
  /** timestamp 的描述 */
  timestamp: Date;
}

// 风险评估
export interface IRiskAssessment {
  /** overallRisk 的描述 */
  overallRisk: RiskLevelType;
  /** riskFactors 的描述 */
  riskFactors: IRiskFactor[];
  /** recommendations 的描述 */
  recommendations: IRecommendation[];
  /** nextCheckDate 的描述 */
  nextCheckDate: Date;
}

export type RiskLevelType = 'low' | 'medium' | 'high' | 'critical';

export interface IRiskFactor {
  /** type 的描述 */
  type: string;
  /** level 的描述 */
  level: RiskLevelType;
  /** description 的描述 */
  description: string;
  /** metrics 的描述 */
  metrics: {
    current: number;
    threshold: number;
    unit: string;
  };
  /** trend 的描述 */
  trend: 'improving' | 'stable' | 'worsening';
}

// 健康建议
export interface IRecommendation {
  /** category 的描述 */
  category: 'exercise' | 'diet' | 'sleep' | 'lifestyle';
  /** priority 的描述 */
  priority: 'high' | 'medium' | 'low';
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** actions 的描述 */
  actions: string[];
  /** expectedBenefits 的描述 */
  expectedBenefits: string[];
}

// 异常检测
export interface IAnomaly {
  /** metric 的描述 */
  metric: string;
  /** value 的描述 */
  value: number;
  /** expectedRange 的描述 */
  expectedRange: {
    min: number;
    max: number;
  };
  /** severity 的描述 */
  severity: RiskLevelType;
  /** timestamp 的描述 */
  timestamp: Date;
  /** context 的描述 */
  context?: string;
}
