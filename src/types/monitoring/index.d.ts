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
    usage: number;  CPU
    temperature: number;  CPU
    processes: number;  
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
    avg: number;  
    p95: number;  95
    p99: number;  99
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
    severity: low  medium  high  critical;
  source: string;
  metric: string;
  threshold: number;
  value: number;
  timestamp: Date;
  description: string;
  impact: string;
  suggestions: string;
}

// 优化计划
export interface IOptimizationPlan {
  /** id 的描述 */
    id: string;
  /** target 的描述 */
    target: system  application  database  network;
  priority: low  medium  high;
  currentMetrics: PartialPerformanceMetrics;
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
