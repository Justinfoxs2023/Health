/**
 * @fileoverview TS 文件 metrics-chart.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 图表配置
export interface IChartConfig {
  // 时间范围选项
  /** timeRanges 的描述 */
  timeRanges: Array<{
    value: '1h' | '24h' | '7d' | '30d';
    label: string;
  }>;

  // 指标配置
  /** metrics 的描述 */
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
  /** style 的描述 */
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
  /** animation 的描述 */
  animation: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
}

// 图表数据
export interface IChartData {
  // 时间序列数据
  /** series 的描述 */
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
  /** baselines 的描述 */
  baselines?: {
    memory?: number;
    cpu?: number;
    fps?: number;
    network?: number;
  };

  // 标注点
  /** annotations 的描述 */
  annotations?: Array<{
    timestamp: Date;
    type: 'event' | 'alert' | 'milestone';
    metric: keyof IChartData['series'][0]['metrics'];
    value: number;
    label: string;
    description?: string;
  }>;
}

// 图表交互事件
export interface IChartEvent {
  /** type 的描述 */
  type: 'hover' | 'click' | 'select' | 'zoom' | 'pan';
  /** data 的描述 */
  data: {
    timestamp: Date;
    metric: keyof IChartData['series'][0]['metrics'];
    value: number;
    index: number;
  };
  /** position 的描述 */
  position: {
    x: number;
    y: number;
  };
}

// 图表分析结果
export interface IChartAnalysis {
  // 趋势分析
  /** trends 的描述 */
  trends: Array<{
    metric: keyof IChartData['series'][0]['metrics'];
    direction: 'up' | 'down' | 'stable';
    change: number;
    period: {
      start: Date;
      end: Date;
    };
    significance: number;
  }>;

  // 异常检测
  /** anomalies 的描述 */
  anomalies: Array<{
    timestamp: Date;
    metric: keyof IChartData['series'][0]['metrics'];
    value: number;
    expectedValue: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
  }>;

  // 性能洞察
  /** insights 的描述 */
  insights: Array<{
    type: 'trend' | 'anomaly' | 'correlation' | 'pattern';
    metric: keyof IChartData['series'][0]['metrics'];
    message: string;
    importance: number;
    timestamp?: Date;
    relatedMetrics?: Array<keyof IChartData['series'][0]['metrics']>;
  }>;

  // 统计摘要
  /** summary 的描述 */
  summary: {
    [K in keyof IChartData['series'][0]['metrics']]: {
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
