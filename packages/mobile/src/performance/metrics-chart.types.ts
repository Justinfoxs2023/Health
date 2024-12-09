// 图表配置
export interface ChartConfig {
  // 时间范围选项
  timeRanges: Array<{
    value: '1h' | '24h' | '7d' | '30d';
    label: string;
  }>;

  // 指标配置
  metrics: {
    memory: {
      label: string;
      unit: string;
      color: string;
      thresholds: {
        warning: number;
        critical: number;
      };
    };
    cpu: {
      label: string;
      unit: string;
      color: string;
      thresholds: {
        warning: number;
        critical: number;
      };
    };
    fps: {
      label: string;
      unit: string;
      color: string;
      thresholds: {
        warning: number;
        critical: number;
      };
    };
    network: {
      label: string;
      unit: string;
      color: string;
      thresholds: {
        warning: number;
        critical: number;
      };
    };
  };

  // 图表样式
  style: {
    height: number;
    padding: number;
    borderRadius: number;
    fontFamily: string;
    fontSize: {
      title: number;
      label: number;
      value: number;
    };
    colors: {
      background: string;
      grid: string;
      text: string;
      axis: string;
    };
  };

  // 动画配置
  animation: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
}

// 图表数据
export interface ChartData {
  // 时间序列数据
  series: Array<{
    timestamp: Date;
    metrics: {
      memory: number;
      cpu: number;
      fps: number;
      network: number;
    };
  }>;

  // 基准线
  baselines?: {
    memory?: number;
    cpu?: number;
    fps?: number;
    network?: number;
  };

  // 标注点
  annotations?: Array<{
    timestamp: Date;
    type: 'event' | 'alert' | 'milestone';
    metric: keyof ChartData['series'][0]['metrics'];
    value: number;
    label: string;
    description?: string;
  }>;
}

// 图表交互事件
export interface ChartEvent {
  type: 'hover' | 'click' | 'select' | 'zoom' | 'pan';
  data: {
    timestamp: Date;
    metric: keyof ChartData['series'][0]['metrics'];
    value: number;
    index: number;
  };
  position: {
    x: number;
    y: number;
  };
}

// 图表分析结果
export interface ChartAnalysis {
  // 趋势分析
  trends: Array<{
    metric: keyof ChartData['series'][0]['metrics'];
    direction: 'up' | 'down' | 'stable';
    change: number;
    period: {
      start: Date;
      end: Date;
    };
    significance: number;
  }>;

  // 异常检测
  anomalies: Array<{
    timestamp: Date;
    metric: keyof ChartData['series'][0]['metrics'];
    value: number;
    expectedValue: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
  }>;

  // 性能洞察
  insights: Array<{
    type: 'trend' | 'anomaly' | 'correlation' | 'pattern';
    metric: keyof ChartData['series'][0]['metrics'];
    message: string;
    importance: number;
    timestamp?: Date;
    relatedMetrics?: Array<keyof ChartData['series'][0]['metrics']>;
  }>;

  // 统计摘要
  summary: {
    [K in keyof ChartData['series'][0]['metrics']]: {
      min: number;
      max: number;
      avg: number;
      median: number;
      std: number;
      percentiles: {
        p90: number;
        p95: number;
        p99: number;
      };
    };
  };
} 