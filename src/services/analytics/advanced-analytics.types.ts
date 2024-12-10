// 高级分析配置
export interface AdvancedAnalyticsConfig {
  predictionHorizon: number;  // 预测时间范围(天)
  confidenceLevel: number;    // 置信水平(0-1)
  updateFrequency: number;    // 更新频率(分钟)
  anomalyThreshold: number;   // 异常阈值
}

// 健康趋势分析
export interface HealthTrendAnalysis {
  userId: string;
  timestamp: Date;
  
  // 关键指标趋势
  metrics: Array<{
    name: string;
    currentValue: number;
    historicalValues: Array<{
      value: number;
      timestamp: Date;
    }>;
    trend: {
      direction: 'up' | 'down' | 'stable';
      rate: number;  // 变化率
      significance: number;  // 显著性
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
    horizon: string;  // 预测时间范围
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
export interface ModelPerformance {
  modelId: string;
  metric: string;
  timestamp: Date;
  
  // 模型评估指标
  metrics: {
    mse: number;      // 均方误差
    rmse: number;     // 均方根误差
    mae: number;      // 平均绝对误差
    r2: number;       // R方值
    accuracy: number; // 准确率(分类问题)
  };

  // 特征重要性
  featureImportance: Array<{
    feature: string;
    importance: number;
    stability: number;
  }>;

  // 模型诊断
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
export interface AdvancedVisualization {
  // 多维分析
  dimensions: Array<{
    name: string;
    type: 'categorical' | 'numerical' | 'temporal';
    aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
    filter?: {
      operator: 'eq' | 'gt' | 'lt' | 'between';
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
export interface AnalyticsReport {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  
  // 报告内容
  content: {
    summary: {
      title: string;
      highlights: string[];
      score: number;
    };
    sections: Array<{
      title: string;
      description: string;
      visualizations: AdvancedVisualization[];
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