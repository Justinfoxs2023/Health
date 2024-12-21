/**
 * @fileoverview TS 文件 performance.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 性能指标
export interface IPerformanceMetrics {
  // 内存指标
  /** memory 的描述 */
  memory: {
    used: number; // 已用内存(bytes)
    total: number; // 总内存(bytes)
    limit: number; // 内存限制(bytes)
  };

  // CPU指标
  /** cpu 的描述 */
  cpu: {
    usage: number; // CPU使用率(0-1)
    temperature: number; // CPU温度(°C)
  };

  // 帧率指标
  /** fps 的描述 */
  fps: {
    current: number; // 当前帧率
    average: number; // 平均帧率
    drops: number; // 掉帧次数
  };

  // 网络指标
  /** network 的描述 */
  network: {
    rtt: number; // 往返时延(ms)
    downlink: number; // 下行速度(Mbps)
    effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  };

  // 电池指标
  /** battery 的描述 */
  battery: {
    level: number; // 电量水平(0-1)
    charging: boolean; // 是否充电
  };
}

// 性能警告
export interface IPerformanceWarning {
  /** type 的描述 */
  type: 'memory' | 'cpu' | 'fps' | 'network' | 'battery';
  /** level 的描述 */
  level: 'low' | 'medium' | 'high';
  /** message 的描述 */
  message: string;
  /** timestamp 的描述 */
  timestamp?: Date;
  /** data 的描述 */
  data?: any;
}

// 优化建议
export interface IOptimizationSuggestion {
  /** type 的描述 */
  type: string;
  /** priority 的描述 */
  priority: 'low' | 'medium' | 'high';
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** actions 的描述 */
  actions: string[];
  /** impact 的描述 */
  impact?: string;
  /** effort 的描述 */
  effort?: string;
}

// 性能报告
export interface IPerformanceReport {
  /** timestamp 的描述 */
  timestamp: Date;
  /** metrics 的描述 */
  metrics: IPerformanceMetrics;
  /** warnings 的描述 */
  warnings: IPerformanceWarning[];
  /** suggestions 的描述 */
  suggestions: IOptimizationSuggestion[];
  /** score 的描述 */
  score: number; // 0-100的性能评分
}

// 性能监控配置
export interface IPerformanceConfig {
  // 监控间隔
  /** intervals 的描述 */
  intervals: {
    memory: number; // 内存监控间隔(ms)
    cpu: number; // CPU监控间隔(ms)
    fps: number; // 帧率监控间隔(ms)
    network: number; // 网络监控间隔(ms)
  };

  // 警告阈值
  /** thresholds 的描述 */
  thresholds: {
    memory: number; // 内存使用率警告阈值(0-1)
    cpu: number; // CPU使用率警告阈值(0-1)
    fps: number; // 最低可接受帧率
    temperature: number; // CPU温度警告阈值(°C)
    rtt: number; // 网络延迟警告阈值(ms)
  };

  // 自动优化
  /** autoOptimize 的描述 */
  autoOptimize: {
    enabled: boolean;
    strategies: {
      memoryCleanup: boolean; // 自动内存清理
      imageOptimization: boolean; // 图片优化
      codeOptimization: boolean; // 代码优化
    };
  };
}
