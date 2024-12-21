/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 预测分析类型
export interface IPredictiveAnalysis {
   
  /** riskPrediction 的描述 */
    riskPrediction: {
    userId: string;
    timestamp: Date;
    predictions: Array{
      riskType: string;
      probability: number;
      confidence: number;
      factors: Array{
        name: string;
        weight: number;
        contribution: number;
      }>;
      timeline: {
        shortTerm: number; // 1个月内风险
        mediumTerm: number; // 3个月内风险
        longTerm: number; // 6个月内风险
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
export interface IRealTimeAnalytics {
   
  /** metrics 的描述 */
    metrics: {
    timestamp: Date;
    values: Recordstring, number;
    trends: Record
      string,
      {
        direction: up  down  stable;
        rate: number;
        significance: number;
      }
    >;
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
  thresholds: Record<
    string,
    {
      current: {
        min: number;
        max: number;
      };
      adaptive: {
        baseline: number;
        tolerance: number;
        adjustmentFactor: number;
      };
    }
  >;
}

// 数据可视化类型
export interface IVisualizationData {
   
  /** chartConfig 的描述 */
    chartConfig: {
    type: line  bar  scatter  radar  custom;
    dimensions: string;
    metrics: string;
    filters: Recordstring, any;
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
export interface IAnalyticsResult {
  /** predictive 的描述 */
    predictive: IPredictiveAnalysis;
  /** realTime 的描述 */
    realTime: IRealTimeAnalytics;
  /** visualization 的描述 */
    visualization: IVisualizationData;
  /** metadata 的描述 */
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
