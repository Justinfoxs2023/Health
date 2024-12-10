// 监控配置
export interface MonitoringConfig {
  sampleRate: number;  // 采样率
  retentionDays: number;  // 数据保留天数
  alertThresholds: {
    error: number;     // 错误率阈值
    latency: number;   // 延迟阈值(ms)
    memory: number;    // 内存使用阈值(%)
    cpu: number;       // CPU使用阈值(%)
  };
}

// 链路追踪
export interface TraceSpan {
  id: string;
  parentId?: string;
  traceId: string;
  name: string;
  kind: 'client' | 'server' | 'producer' | 'consumer';
  timestamp: number;
  duration: number;
  
  // 追踪属性
  attributes: {
    service: string;
    operation: string;
    component: string;
    'http.method'?: string;
    'http.url'?: string;
    'http.status_code'?: number;
    'db.system'?: string;
    'db.statement'?: string;
    [key: string]: any;
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
export interface PerformanceMetrics {
  timestamp: Date;
  
  // 系统指标
  system: {
    cpu: {
      usage: number;
      load: number[];
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
export interface Alert {
  id: string;
  type: 'error' | 'performance' | 'resource' | 'security';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  
  // 告警内容
  content: {
    title: string;
    message: string;
    source: string;
    metric?: string;
    threshold?: number;
    value?: number;
    metadata?: Record<string, any>;
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
export interface UserExperience {
  sessionId: string;
  userId?: string;
  timestamp: Date;
  
  // 页面性能
  pageMetrics: {
    url: string;
    loadTime: number;
    domReady: number;
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint?: number;
    firstInputDelay?: number;
    cumulativeLayoutShift?: number;
  };

  // 资源性能
  resources: Array<{
    url: string;
    type: 'script' | 'style' | 'image' | 'font' | 'other';
    duration: number;
    size: number;
    failed: boolean;
  }>;

  // 错误信息
  errors: Array<{
    type: string;
    message: string;
    stack?: string;
    timestamp: number;
  }>;

  // 用户行为
  interactions: Array<{
    type: string;
    target: string;
    timestamp: number;
    duration?: number;
    metadata?: Record<string, any>;
  }>;

  // 网络状况
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };

  // 设备信息
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
export interface MonitoringReport {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident';
  period: {
    start: Date;
    end: Date;
  };

  // 系统健康状况
  healthStatus: {
    overall: 'healthy' | 'degraded' | 'critical';
    components: Record<string, {
      status: 'healthy' | 'degraded' | 'critical';
      metrics: Record<string, number>;
    }>;
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
    mttr: number;  // 平均恢复时间
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
      trend: number;  // 相比上期的变化
    };
    optimization: {
      potential: number;  // 潜在节省
      suggestions: Array<{
        type: string;
        impact: number;
        difficulty: 'easy' | 'medium' | 'hard';
      }>;
    };
  };

  // 用户体验
  userExperience: {
    satisfaction: number;  // 0-100
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