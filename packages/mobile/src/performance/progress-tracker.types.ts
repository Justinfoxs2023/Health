// 优化进度类型
export interface OptimizationProgress {
  type: 'memory' | 'performance' | 'network';
  current: number;
  target: number;
  status: 'improved' | 'warning' | 'critical';
}

// 优化历史记录
export interface OptimizationHistory {
  id: string;
  type: string;
  timestamp: Date;
  before: number;
  after: number;
  improvement: number;
  details?: {
    action: string;
    impact: string;
    duration: number;
  };
}

// 优化建议
export interface OptimizationSuggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  impact: number;
  icon: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// 进度追踪配置
export interface ProgressTrackerConfig {
  refreshInterval: number;
  thresholds: {
    warning: number;
    critical: number;
  };
  targets: {
    memory: number;
    performance: number;
    network: number;
  };
} 