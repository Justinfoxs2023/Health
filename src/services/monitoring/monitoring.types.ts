/**
 * @fileoverview TS 文件 monitoring.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 监控配置
export interface IMonitoringConfig {
  /** sampleRate 的描述 */
    sampleRate: number;  
  /** retentionDays 的描述 */
    retentionDays: number;  
  /** alertThresholds 的描述 */
    alertThresholds: {
    error: number;  
    latency: number;  ms
    memory: number;  
    cpu: number;  CPU
  };
}

// 链路追踪
export interface ITraceSpan {
  /** id 的描述 */
    id: string;
  /** parentId 的描述 */
    parentId: string;
  /** traceId 的描述 */
    traceId: string;
  /** name 的描述 */
    name: string;
  /** kind 的描述 */
    kind: client  server  producer  consumer;
  timestamp: number;
  duration: number;

   
  attributes: {
    service: string;
    operation: string;
    component: string;
    httpmethod: string;
    httpurl: string;
    httpstatus_code: number;
    dbsystem: string;
    dbstatement: string;
    key: string: any;
  };

  // 事件记录
  events: Array<{
    name: string;
    timestamp: number;
    attributes?: Record<string, any>;
  }>;

  // 状态信息
  status: {
    code: 'ok' | 'error' | 'unset';
    message?: string;
  };
}

// 性能指标
export interface IPerformanceMetrics {
  /** timestamp 的描述 */
    timestamp: Date;

   
  /** system 的描述 */
    system: {
    cpu: {
      usage: number;
      load: number;
      processes: number;
    };
    memory: {
      total: number;
      used: number;
      free: number;
      cached: number;
      buffers: number;
    };
    disk: {
      total: number;
      used: number;
      free: number;
      io: {
        reads: number;
        writes: number;
      };
    };
    network: {
      bytesIn: number;
      bytesOut: number;
      connections: number;
      errors: number;
    };
  };

  // 应用指标
  /** application 的描述 */
    application: {
    requests: {
      total: number;
      active: number;
      errors: number;
      latency: {
        p50: number;
        p90: number;
        p99: number;
      };
    };
    database: {
      connections: number;
      activeQueries: number;
      slowQueries: number;
      errors: number;
    };
    cache: {
      hits: number;
      misses: number;
      size: number;
      evictions: number;
    };
    jvm?: {
      heap: {
        used: number;
        committed: number;
        max: number;
      };
      threads: {
        active: number;
        peak: number;
        daemon: number;
      };
      gc: {
        collections: number;
        time: number;
      };
    };
  };
}

// 告警定义
export interface IAlert {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: error  performance  resource  security;
  severity: critical  high  medium  low;
  status: active  acknowledged  resolved;
  createdAt: Date;
  updatedAt: Date;

   
  content: {
    title: string;
    message: string;
    source: string;
    metric: string;
    threshold: number;
    value: number;
    metadata: Recordstring, any;
  };

  // 影响范围
  impact: {
    services: string[];
    users?: number;
    transactions?: number;
  };

  // 处理信息
  resolution?: {
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    resolvedBy?: string;
    resolvedAt?: Date;
    action?: string;
    notes?: string;
  };

  // 自动恢复
  autoRecovery?: {
    enabled: boolean;
    attempts: number;
    lastAttempt?: Date;
    actions: string[];
    success?: boolean;
  };
}

// 用户体验监控
export interface IUserExperience {
  /** sessionId 的描述 */
    sessionId: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;

   
  /** pageMetrics 的描述 */
    pageMetrics: {
    url: string;
    loadTime: number;
    domReady: number;
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
  };

  // 资源性能
  /** resources 的描述 */
    resources: Array<{
    url: string;
    type: 'script' | 'style' | 'image' | 'font' | 'other';
    duration: number;
    size: number;
    failed: boolean;
  }>;

  // 错误信息
  /** errors 的描述 */
    errors: Array<{
    type: string;
    message: string;
    stack?: string;
    timestamp: number;
  }>;

  // 用户行为
  /** interactions 的描述 */
    interactions: Array<{
    type: string;
    target: string;
    timestamp: number;
    duration?: number;
    metadata?: Record<string, any>;
  }>;

  // 网络状况
  /** network 的描述 */
    network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };

  // 设备信息
  /** device 的描述 */
    device: {
    type: string;
    os: string;
    browser: string;
    screenSize: {
      width: number;
      height: number;
    };
  };
}

// 监控报告
export interface IMonitoringReport {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: daily  weekly  monthly  incident;
  period: {
    start: Date;
    end: Date;
  };

  // 系统健康状况
  healthStatus: {
    overall: 'healthy' | 'degraded' | 'critical';
    components: Record<
      string,
      {
        status: 'healthy' | 'degraded' | 'critical';
        metrics: Record<string, number>;
      }
    >;
  };

  // 性能分析
  performance: {
    trends: Array<{
      metric: string;
      values: Array<{
        timestamp: Date;
        value: number;
      }>;
      summary: {
        min: number;
        max: number;
        avg: number;
        p95: number;
      };
    }>;
    bottlenecks: Array<{
      component: string;
      metric: string;
      severity: 'high' | 'medium' | 'low';
      impact: string;
      recommendations: string[];
    }>;
  };

  // 告警统计
  alerts: {
    total: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    mttr: number; // 平均恢复时间
    topIssues: Array<{
      type: string;
      count: number;
      impact: string;
    }>;
  };

  // 资源使用
  resources: {
    usage: {
      cpu: number;
      memory: number;
      disk: number;
      network: number;
    };
    costs: {
      total: number;
      byService: Record<string, number>;
      trend: number; // 相比上期的变化
    };
    optimization: {
      potential: number; // 潜在节省
      suggestions: Array<{
        type: string;
        impact: number;
        difficulty: 'easy' | 'medium' | 'hard';
      }>;
    };
  };

  // 用户体验
  userExperience: {
    satisfaction: number; // 0-100
    metrics: {
      avgPageLoad: number;
      avgFirstInput: number;
      errorRate: number;
    };
    issues: Array<{
      type: string;
      affectedUsers: number;
      impact: string;
    }>;
  };
}
