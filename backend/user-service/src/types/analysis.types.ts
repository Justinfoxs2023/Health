/**
 * @fileoverview TS 文件 analysis.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export type TimeRangeType = 'day' | 'week' | 'month' | 'year';

export interface IAnalysisMetric {
  /** name 的描述 */
  name: string;
  /** value 的描述 */
  value: number;
  /** unit 的描述 */
  unit?: string;
  /** trend 的描述 */
  trend?: 'up' | 'down' | 'stable';
}

export interface IHealthTrend {
  /** timestamp 的描述 */
  timestamp: string;
  /** metrics 的描述 */
  metrics: Record<string, number[]>;
}

export interface IAnalysisResult {
  /** trends 的描述 */
  trends: IHealthTrend[];
  /** metrics 的描述 */
  metrics: IAnalysisMetric[];
  /** summary 的描述 */
  summary: {
    score: number;
    recommendations: string[];
  };
}

export interface IAnalysisOptions {
  /** timeRange 的描述 */
  timeRange: TimeRangeType;
  /** metrics 的描述 */
  metrics?: string[];
  /** includeRecommendations 的描述 */
  includeRecommendations?: boolean;
}
