// 性能指标类型
export interface PerformanceMetrics {
  timestamp: Date;
  system: SystemMetrics;
  application: ApplicationMetrics;
  database: DatabaseMetrics;
  network: NetworkMetrics;
}

// 系统指标
export interface SystemMetrics {
  cpu: {
    usage: number;        // CPU使用率
    temperature: number;  // CPU温度
    processes: number;    // 进程数
  };
  memory: {
    total: number;       // 总内存
    used: number;        // 已用内存
    free: number;        // 空闲内存
    cached: number;      // 缓存内存
  };
  disk: {
    total: number;       // 总空间
    used: number;        // 已用空间
    free: number;        // 空闲空间
    io: {
      read: number;      // 读取速率
      write: number;     // 写入速率
    };
  };
}

// 应用指标
export interface ApplicationMetrics {
  response: {
    avg: number;         // 平均响应时间
    p95: number;         // 95分位响应时间
    p99: number;         // 99分位响应时间
  };
  throughput: {
    requests: number;    // 请求数/秒
    success: number;     // 成功数/秒
    errors: number;      // 错误数/秒
  };
  concurrent: {
    users: number;       // 并发用户数
    sessions: number;    // 活跃会话数
  };
}

// 系统异常
export interface SystemAnomaly {
  id: string;
  type: AnomalyType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  metric: string;
  threshold: number;
  value: number;
  timestamp: Date;
  description: string;
  impact: string[];
  suggestions: string[];
}

// 优化计划
export interface OptimizationPlan {
  id: string;
  target: 'system' | 'application' | 'database' | 'network';
  priority: 'low' | 'medium' | 'high';
  currentMetrics: Partial<PerformanceMetrics>;
  expectedImprovements: {
    metric: string;
    current: number;
    target: number;
    impact: string;
  }[];
  actions: OptimizationAction[];
  estimatedEffort: string;
  risks: Risk[];
} 