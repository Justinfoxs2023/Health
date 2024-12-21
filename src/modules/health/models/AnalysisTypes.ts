/**
 * @fileoverview TS 文件 AnalysisTypes.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IAnalysisResult {
  /** trends 的描述 */
    trends: IHealthTrend;
  /** risks 的描述 */
    risks: IHealthRisk;
  /** advice 的描述 */
    advice: IHealthAdvice;
  /** timestamp 的描述 */
    timestamp: Date;
}

export interface IHealthTrend {
  /** metric 的描述 */
    metric: string;
  /** trend 的描述 */
    trend: increasing  decreasing  stable;
  changeRate: number;
  period: string;
  confidence: number;
}

export interface IHealthRisk {
  /** type 的描述 */
    type: string;
  /** level 的描述 */
    level: low  medium  high;
  description: string;
  factors: string;
  recommendations: string;
}

export interface IHealthAdvice {
  /** category 的描述 */
    category: string;
  /** priority 的描述 */
    priority: low  medium  high;
  title: string;
  description: string;
  actions: string;
  expectedOutcomes: string;
  timeframe: string;
}
