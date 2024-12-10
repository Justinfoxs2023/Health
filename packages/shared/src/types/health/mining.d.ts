// 数据挖掘类型
export interface DataMiningResult {
  patterns: HealthPattern[];
  correlations: Correlation[];
  clusters: HealthCluster[];
  anomalies: DataAnomaly[];
  insights: MiningInsight[];
}

// 健康模式
export interface HealthPattern {
  id: string;
  type: PatternType;
  description: string;
  confidence: number;
  support: number;
  timeRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  rules: PatternRule[];
}

// 相关性分析
export interface Correlation {
  metrics: [string, string];
  coefficient: number;
  significance: number;
  type: 'positive' | 'negative' | 'none';
  strength: 'weak' | 'moderate' | 'strong';
  context: string[];
}

// 健康聚类
export interface HealthCluster {
  id: string;
  centroid: number[];
  size: number;
  characteristics: {
    metric: string;
    average: number;
    range: [number, number];
  }[];
  members: string[]; // userId列表
  label?: string;
}

// 数据异常
export interface DataAnomaly {
  id: string;
  metric: string;
  value: number;
  expectedRange: [number, number];
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  context: {
    relatedMetrics: string[];
    environmentalFactors: string[];
    userActivity: string;
  };
} 