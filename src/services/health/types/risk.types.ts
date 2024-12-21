/**
 * @fileoverview TS 文件 risk.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 生活方式风险
export interface ILifestyleRisk {
  /** category 的描述 */
    category: diet  exercise  sleep  stress  substance;
  level: low  moderate  high;
  factors: string;
  impact: {
    immediate: string;
    longTerm: string;
  };
  recommendations: {
    priority: 'urgent' | 'important' | 'recommended';
    actions: string[];
    resources: string[];
  };
}

// 遗传风险
export interface IGeneticRisk {
  /** condition 的描述 */
    condition: string;
  /** probability 的描述 */
    probability: number;
  /** inheritance 的描述 */
    inheritance: dominant  recessive  complex;
  variants: Array{
    gene: string;
    mutation: string;
    significance: string;
  }>;
  preventiveMeasures: string[];
  monitoringPlan: {
    tests: string[];
    frequency: string;
    indicators: string[];
  };
}

// 环境风险
export interface IEnvironmentalRisk {
  /** type 的描述 */
    type: physical  chemical  biological  social;
  source: string;
  exposure: {
    level: number;
    duration: string;
    frequency: string;
  };
  potentialImpact: {
    immediate: string[];
    chronic: string[];
    conditions: string[];
  };
  preventiveMeasures: {
    personal: string[];
    environmental: string[];
    monitoring: string[];
  };
}

// 风险阈值
export interface IRiskThreshold {
  /** metric 的描述 */
    metric: string;
  /** ranges 的描述 */
    ranges: {
    normal: number, number;
    warning: number, number;
    critical: number, number;
  };
  /** adjustments 的描述 */
    adjustments: {
    age: Record<string, number>;
    gender: Record<string, number>;
    condition: Record<string, number>;
  };
  /** monitoring 的描述 */
    monitoring: {
    frequency: string;
    method: string;
    accuracy: number;
  };
}
