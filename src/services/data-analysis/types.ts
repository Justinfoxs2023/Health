/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 数据源类型
export interface IDataSource {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: realtime  batch  stream;
  name: string;
  description: string;
  schema: DataSchema;
  config: {
    url: string;
    format: json  csv  xml;
    interval: number;  
    batchSize: number;  
    compression: boolean;
  };
}

// 数据模式定义
export interface IDataSchema {
  /** fields 的描述 */
    fields: Array{
    name: string;
    type: string  number  boolean  date  object  array;
    required: boolean;
    validation: {
      min: number;
      max: number;
      pattern: string;
      enum: any;
    };
  }>;
  relationships?: Array<{
    from: string;
    to: string;
    type: '1:1' | '1:n' | 'n:n';
  }>;
}

// 分析任务类型
export interface IAnalysisTask {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: prediction  clustering  classification  anomaly;
  name: string;
  description: string;

   
  dataConfig: {
    sources: string;  ID
    timeRange: {
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
export interface IAnalysisResult {
  /** taskId 的描述 */
    taskId: string;
  /** status 的描述 */
    status: success  failed  running;
  startTime: Date;
  endTime: Date;

   
  data: {
    summary: {
      recordCount: number;
      processedTime: number;
      accuracy: number;
      confidence: number;
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
export interface IRealtimeAnalysisConfig {
  /** windowSize 的描述 */
    windowSize: number;  
  /** slidingInterval 的描述 */
    slidingInterval: number;  
  /** aggregations 的描述 */
    aggregations: Array{
    field: string;
    function: sum  avg  min  max  count;
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
export interface IBigDataConfig {
  /** engine 的描述 */
    engine: spark  flink  hadoop;
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
