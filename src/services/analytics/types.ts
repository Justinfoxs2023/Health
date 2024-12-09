// 预测分析类型
export interface PredictiveAnalysis {
  // 健康风险预测
  riskPrediction: {
    userId: string;
    timestamp: Date;
    predictions: Array<{
      riskType: string;
      probability: number;
      confidence: number;
      factors: Array<{
        name: string;
        weight: number;
        contribution: number;
      }>;
      timeline: {
        shortTerm: number;  // 1个月内风险
        mediumTerm: number; // 3个月内风险
        longTerm: number;   // 6个月内风险
      };
    }>;
  };

  // 疾病预警
  diseaseAlert: {
    conditions: Array<{
      name: string;
      risk: number;
      urgency: 'low' | 'medium' | 'high';
      symptoms: string[];
      preventiveMeasures: string[];
    }>;
    environmentalFactors: Array<{
      factor: string;
      impact: number;
      recommendations: string[];
    }>;
  };

  // 生活方式影响
  lifestyleImpact: {
    currentScore: number;
    trends: Array<{
      aspect: string;
      impact: number;
      direction: 'improving' | 'stable' | 'worsening';
      suggestions: string[];
    }>;
    projections: Array<{
      scenario: string;
      healthScore: number;
      timeframe: string;
      changes: Record<string, number>;
    }>;
  };
}

// 实时分析类型
export interface RealTimeAnalytics {
  // 实时健康指标
  metrics: {
    timestamp: Date;
    values: Record<string, number>;
    trends: Record<string, {
      direction: 'up' | 'down' | 'stable';
      rate: number;
      significance: number;
    }>;
  };

  // 异常检测
  anomalies: Array<{
    metric: string;
    value: number;
    expectedRange: {
      min: number;
      max: number;
    };
    deviation: number;
    severity: 'low' | 'medium' | 'high';
    context: Record<string, any>;
  }>;

  // 动态阈值
  thresholds: Record<string, {
    current: {
      min: number;
      max: number;
    };
    adaptive: {
      baseline: number;
      tolerance: number;
      adjustmentFactor: number;
    };
  }>;
}

// 数据可视化类型
export interface VisualizationData {
  // 图表配置
  chartConfig: {
    type: 'line' | 'bar' | 'scatter' | 'radar' | 'custom';
    dimensions: string[];
    metrics: string[];
    filters: Record<string, any>;
    interactions: {
      zoom: boolean;
      brush: boolean;
      tooltip: boolean;
      legend: boolean;
    };
  };

  // 数据转换
  transformations: Array<{
    type: 'aggregate' | 'filter' | 'sort' | 'calculate';
    params: Record<string, any>;
    field: string;
    output: string;
  }>;

  // 可视化选项
  visualOptions: {
    theme: string;
    color: string[];
    animation: {
      enabled: boolean;
      duration: number;
      easing: string;
    };
    responsive: boolean;
    layout: {
      padding: Record<string, number>;
      aspectRatio: number;
    };
  };
}

// 分析结果类型
export interface AnalyticsResult {
  predictive?: PredictiveAnalysis;
  realTime?: RealTimeAnalytics;
  visualization?: VisualizationData;
  metadata: {
    generatedAt: Date;
    version: string;
    quality: {
      accuracy: number;
      completeness: number;
      reliability: number;
    };
  };
} 