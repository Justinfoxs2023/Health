/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 性能指标类型
export interface IPerformanceMetrics {
  /** timestamp 的描述 */
  timestamp: Date;
  /** system 的描述 */
  system: ISystemMetrics;
  /** application 的描述 */
  application: IApplicationMetrics;
  /** database 的描述 */
  database: DatabaseMetrics;
  /** network 的描述 */
  network: NetworkMetrics;
}

// 系统指标
export interface ISystemMetrics {
  /** cpu 的描述 */
  cpu: {
    usage: number; // CPU使用率
    temperature: number; // CPU温度
    processes: number; // 进程数
  };
  /** memory 的描述 */
  memory: {
    total: number; // 总内存
    used: number; // 已用内存
    free: number; // 空闲内存
    cached: number; // 缓存内存
  };
  /** disk 的描述 */
  disk: {
    total: number; // 总空间
    used: number; // 已用空间
    free: number; // 空闲空间
    io: {
      read: number; // 读取速率
      write: number; // 写入速率
    };
  };
}

// 应用指标
export interface IApplicationMetrics {
  /** response 的描述 */
  response: {
    avg: number; // 平均响应时间
    p95: number; // 95分位响应时间
    p99: number; // 99分位响应时间
  };
  /** throughput 的描述 */
  throughput: {
    requests: number; // 请求数/秒
    success: number; // 成功数/秒
    errors: number; // 错误数/秒
  };
  /** concurrent 的描述 */
  concurrent: {
    users: number; // 并发用户数
    sessions: number; // 活跃会话数
  };
}

// 系统异常
export interface ISystemAnomaly {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: AnomalyType;
  /** severity 的描述 */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** source 的描述 */
  source: string;
  /** metric 的描述 */
  metric: string;
  /** threshold 的描述 */
  threshold: number;
  /** value 的描述 */
  value: number;
  /** timestamp 的描述 */
  timestamp: Date;
  /** description 的描述 */
  description: string;
  /** impact 的描述 */
  impact: string[];
  /** suggestions 的描述 */
  suggestions: string[];
}

// 优化计划
export interface IOptimizationPlan {
  /** id 的描述 */
  id: string;
  /** target 的描述 */
  target: 'system' | 'application' | 'database' | 'network';
  /** priority 的描述 */
  priority: 'low' | 'medium' | 'high';
  /** currentMetrics 的描述 */
  currentMetrics: Partial<IPerformanceMetrics>;
  /** expectedImprovements 的描述 */
  expectedImprovements: {
    metric: string;
    current: number;
    target: number;
    impact: string;
  }[];
  /** actions 的描述 */
  actions: OptimizationAction[];
  /** estimatedEffort 的描述 */
  estimatedEffort: string;
  /** risks 的描述 */
  risks: Risk[];
}
