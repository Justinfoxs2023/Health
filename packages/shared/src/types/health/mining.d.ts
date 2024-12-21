/**
 * @fileoverview TS 文件 mining.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 数据挖掘类型
export interface IDataMiningResult {
  /** patterns 的描述 */
  patterns: IHealthPattern[];
  /** correlations 的描述 */
  correlations: ICorrelation[];
  /** clusters 的描述 */
  clusters: IHealthCluster[];
  /** anomalies 的描述 */
  anomalies: IDataAnomaly[];
  /** insights 的描述 */
  insights: MiningInsight[];
}

// 健康模式
export interface IHealthPattern {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: PatternType;
  /** description 的描述 */
  description: string;
  /** confidence 的描述 */
  confidence: number;
  /** support 的描述 */
  support: number;
  /** timeRange 的描述 */
  timeRange: {
    start: Date;
    end: Date;
  };
  /** metrics 的描述 */
  metrics: string[];
  /** rules 的描述 */
  rules: PatternRule[];
}

// 相关性分析
export interface ICorrelation {
  /** metrics 的描述 */
  metrics: [string, string];
  /** coefficient 的描述 */
  coefficient: number;
  /** significance 的描述 */
  significance: number;
  /** type 的描述 */
  type: 'positive' | 'negative' | 'none';
  /** strength 的描述 */
  strength: 'weak' | 'moderate' | 'strong';
  /** context 的描述 */
  context: string[];
}

// 健康聚类
export interface IHealthCluster {
  /** id 的描述 */
  id: string;
  /** centroid 的描述 */
  centroid: number[];
  /** size 的描述 */
  size: number;
  /** characteristics 的描述 */
  characteristics: {
    metric: string;
    average: number;
    range: [number, number];
  }[];
  /** members 的描述 */
  members: string[]; // userId列表
  /** label 的描述 */
  label?: string;
}

// 数据异常
export interface IDataAnomaly {
  /** id 的描述 */
  id: string;
  /** metric 的描述 */
  metric: string;
  /** value 的描述 */
  value: number;
  /** expectedRange 的描述 */
  expectedRange: [number, number];
  /** timestamp 的描述 */
  timestamp: Date;
  /** severity 的描述 */
  severity: 'low' | 'medium' | 'high';
  /** context 的描述 */
  context: {
    relatedMetrics: string[];
    environmentalFactors: string[];
    userActivity: string;
  };
}
