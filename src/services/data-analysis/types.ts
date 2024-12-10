// 数据源类型
export interface DataSource {
  id: string;
  type: 'realtime' | 'batch' | 'stream';
  name: string;
  description: string;
  schema: DataSchema;
  config: {
    url: string;
    format: 'json' | 'csv' | 'xml';
    interval?: number; // 实时数据更新间隔
    batchSize?: number; // 批处理大小
    compression?: boolean;
  };
}

// 数据模式定义
export interface DataSchema {
  fields: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
    required: boolean;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      enum?: any[];
    };
  }>;
  relationships?: Array<{
    from: string;
    to: string;
    type: '1:1' | '1:n' | 'n:n';
  }>;
}

// 分析任务类型
export interface AnalysisTask {
  id: string;
  type: 'prediction' | 'clustering' | 'classification' | 'anomaly';
  name: string;
  description: string;
  
  // 数据配置
  dataConfig: {
    sources: string[]; // 数据源ID
    timeRange?: {
      start: Date;
      end: Date;
    };
    filters?: Array<{
      field: string;
      operator: 'eq' | 'gt' | 'lt' | 'contains';
      value: any;
    }>;
  };

  // 分析配置
  analysisConfig: {
    algorithm: string;
    parameters: Record<string, any>;
    features: string[];
    target?: string;
    validation: {
      method: 'cross-validation' | 'holdout';
      ratio?: number;
      metrics: string[];
    };
  };

  // 执行配置
  executionConfig: {
    schedule?: string; // cron表达式
    timeout: number;
    retries: number;
    priority: 'high' | 'medium' | 'low';
  };
}

// 分析结果类型
export interface AnalysisResult {
  taskId: string;
  status: 'success' | 'failed' | 'running';
  startTime: Date;
  endTime?: Date;
  
  // 结果数据
  data: {
    summary: {
      recordCount: number;
      processedTime: number;
      accuracy?: number;
      confidence?: number;
    };
    predictions?: Array<{
      id: string;
      value: any;
      probability: number;
      features: Record<string, any>;
    }>;
    clusters?: Array<{
      id: string;
      centroid: number[];
      size: number;
      members: string[];
    }>;
    anomalies?: Array<{
      id: string;
      score: number;
      timestamp: Date;
      factors: string[];
    }>;
  };

  // 可视化配置
  visualization: {
    type: 'line' | 'scatter' | 'bar' | 'heatmap';
    config: Record<string, any>;
    insights: string[];
  };

  // 性能指标
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    auc?: number;
    mse?: number;
  };
}

// 实时分析配置
export interface RealtimeAnalysisConfig {
  windowSize: number; // 时间窗口大小(秒)
  slidingInterval: number; // 滑动间隔(秒)
  aggregations: Array<{
    field: string;
    function: 'sum' | 'avg' | 'min' | 'max' | 'count';
    window: number;
  }>;
  alerts: Array<{
    metric: string;
    condition: 'gt' | 'lt' | 'eq';
    threshold: number;
    severity: 'high' | 'medium' | 'low';
  }>;
}

// 大数据处理配置
export interface BigDataConfig {
  engine: 'spark' | 'flink' | 'hadoop';
  cluster: {
    nodes: number;
    memory: number;
    cores: number;
  };
  storage: {
    type: 'hdfs' | 's3' | 'gcs';
    path: string;
    format: string;
  };
  processing: {
    parallelism: number;
    checkpointing: boolean;
    recovery: 'none' | 'exactly-once' | 'at-least-once';
  };
} 