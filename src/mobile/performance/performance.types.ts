// 性能指标
export interface PerformanceMetrics {
  // 内存指标
  memory: {
    used: number;      // 已用内存(bytes)
    total: number;     // 总内存(bytes)
    limit: number;     // 内存限制(bytes)
  };

  // CPU指标
  cpu: {
    usage: number;     // CPU使用率(0-1)
    temperature: number; // CPU温度(°C)
  };

  // 帧率指标
  fps: {
    current: number;   // 当前帧率
    average: number;   // 平均帧率
    drops: number;     // 掉帧次数
  };

  // 网络指标
  network: {
    rtt: number;      // 往返时延(ms)
    downlink: number; // 下行速度(Mbps)
    effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  };

  // 电池指标
  battery: {
    level: number;    // 电量水平(0-1)
    charging: boolean; // 是否充电
  };
}

// 性能警告
export interface PerformanceWarning {
  type: 'memory' | 'cpu' | 'fps' | 'network' | 'battery';
  level: 'low' | 'medium' | 'high';
  message: string;
  timestamp?: Date;
  data?: any;
}

// 优化建议
export interface OptimizationSuggestion {
  type: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actions: string[];
  impact?: string;
  effort?: string;
}

// 性能报告
export interface PerformanceReport {
  timestamp: Date;
  metrics: PerformanceMetrics;
  warnings: PerformanceWarning[];
  suggestions: OptimizationSuggestion[];
  score: number;  // 0-100的性能评分
}

// 性能监控配置
export interface PerformanceConfig {
  // 监控间隔
  intervals: {
    memory: number;   // 内存监控间隔(ms)
    cpu: number;      // CPU监控间隔(ms)
    fps: number;      // 帧率监控间隔(ms)
    network: number;  // 网络监控间隔(ms)
  };

  // 警告阈值
  thresholds: {
    memory: number;   // 内存使用率警告阈值(0-1)
    cpu: number;      // CPU使用率警告阈值(0-1)
    fps: number;      // 最低可接受帧率
    temperature: number; // CPU温度警告阈值(°C)
    rtt: number;      // 网络延迟警告阈值(ms)
  };

  // 自动优化
  autoOptimize: {
    enabled: boolean;
    strategies: {
      memoryCleanup: boolean;    // 自动内存清理
      imageOptimization: boolean; // 图片优化
      codeOptimization: boolean;  // 代码优化
    };
  };
} 