/**
 * @fileoverview TS 文件 advanced-analytics.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 高级分析配置
export interface IAdvancedAnalyticsConfig {
  /** predictionHorizon 的描述 */
    predictionHorizon: number;  
  /** confidenceLevel 的描述 */
    confidenceLevel: number;  /** 01 的描述 */
    /** 01 的描述 */
    01
  /** updateFrequency 的描述 */
    updateFrequency: number;  
  /** anomalyThreshold 的描述 */
    anomalyThreshold: number;  
}

// 健康趋势分析
export interface IHealthTrendAnalysis {
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;

   
  /** metrics 的描述 */
    metrics: Array{
    name: string;
    currentValue: number;
    historicalValues: Array{
      value: number;
      timestamp: Date;
    }>;
    trend: {
      direction: 'up' | 'down' | 'stable';
      rate: number; // 变化率
      significance: number; // 显著性
    };
    seasonality?: {
      daily?: number;
      weekly?: number;
      monthly?: number;
    };
  }>;

  // 健康预测
  predictions: Array<{
    metric: string;
    horizon: string; // 预测时间范围
    values: Array<{
      timestamp: Date;
      value: number;
      confidence: {
        lower: number;
        upper: number;
      };
    }>;
    factors: Array<{
      name: string;
      importance: number;
      correlation: number;
    }>;
  }>;

  // 异常检测
  anomalies: Array<{
    metric: string;
    timestamp: Date;
    value: number;
    expectedRange: {
      min: number;
      max: number;
    };
    severity: 'low' | 'medium' | 'high';
    possibleCauses: string[];
  }>;

  // 健康洞察
  insights: Array<{
    type: 'risk' | 'improvement' | 'achievement';
    title: string;
    description: string;
    confidence: number;
    recommendations: Array<{
      action: string;
      impact: number;
      effort: 'low' | 'medium' | 'high';
      timeframe: string;
    }>;
  }>;
}

// 预测模型性能
export interface IModelPerformance {
  /** modelId 的描述 */
    modelId: string;
  /** metric 的描述 */
    metric: string;
  /** timestamp 的描述 */
    timestamp: Date;

   
  /** metrics 的描述 */
    metrics: {
    mse: number;  
    rmse: number;  
    mae: number;  
    r2: number;  R
    accuracy: number;  
  };

  // 特征重要性
  /** featureImportance 的描述 */
    featureImportance: Array<{
    feature: string;
    importance: number;
    stability: number;
  }>;

  // 模型诊断
  /** diagnostics 的描述 */
    diagnostics: {
    residuals: {
      mean: number;
      std: number;
      distribution: 'normal' | 'skewed' | 'other';
    };
    crossValidation: {
      folds: number;
      scores: number[];
      mean: number;
      std: number;
    };
  };
}

// 高级可视化选项
export interface IAdvancedVisualization {
   
  /** dimensions 的描述 */
    dimensions: Array{
    name: string;
    type: categorical  numerical  temporal;
    aggregation: sum  avg  min  max  count;
    filter: {
      operator: eq  gt  lt  between;
      value: any;
    };
  }>;

  // 图表配置
  chart: {
    type: 'line' | 'bar' | 'scatter' | 'heatmap' | 'radar' | 'custom';
    stacking?: boolean;
    smoothing?: boolean;
    annotations?: Array<{
      type: 'line' | 'rect' | 'text';
      position: any;
      content?: string;
    }>;
  };

  // 交互选项
  interactions: {
    zoom: boolean;
    brush: boolean;
    tooltip: {
      enabled: boolean;
      format?: string;
      customContent?: (params: any) => string;
    };
    events: {
      click?: boolean;
      hover?: boolean;
      select?: boolean;
    };
  };

  // 动画配置
  animation: {
    enabled: boolean;
    duration: number;
    easing: string;
    delay?: number;
  };
}

// 分析报告配置
export interface IAnalyticsReport {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** type 的描述 */
    type: daily  weekly  monthly  custom;

   
  content: {
    summary: {
      title: string;
      highlights: string;
      score: number;
    };
    sections: Array<{
      title: string;
      description: string;
      visualizations: IAdvancedVisualization[];
      insights: Array<{
        type: string;
        content: string;
        importance: number;
      }>;
      recommendations: Array<{
        action: string;
        priority: 'high' | 'medium' | 'low';
        impact: string;
      }>;
    }>;
  };

  // 导出选项
  export: {
    formats: ('pdf' | 'excel' | 'json')[];
    scheduling: {
      enabled: boolean;
      frequency: string;
      recipients: string[];
    };
  };
}
