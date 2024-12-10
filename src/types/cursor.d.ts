// 基础类型定义
interface CursorConfig {
  cursor: string;
  area: string[];
  active?: string;
  performance?: PerformanceConfig;
}

interface PerformanceConfig {
  willChange?: string;
  gpuAcceleration?: boolean;
  responseTime?: number;
}

// 交互区域类型定义
interface InteractionArea {
  type: string;
  config: CursorConfig;
  enabled: boolean;
}

// 错误处理类型定义
interface ErrorHandling {
  fallback: string;
  recovery: () => void;
  errorBoundary?: React.ComponentType<any>;
}

// 性能监控类型定义
interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  fps: number;
  loadTime: number;
} 