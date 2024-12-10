// 骨架屏配置
export interface SkeletonConfig {
  // 基础配置
  animation: 'pulse' | 'wave' | 'none';
  duration: number;
  delay: number;
  repeat: boolean;
  
  // 样式配置
  style: {
    backgroundColor: string;
    highlightColor: string;
    borderRadius: number;
    width: string | number;
    height: string | number;
  };

  // 布局配置
  layout: {
    rows: number;
    columns: number;
    gap: number;
    aspectRatio?: number;
  };
}

// 预加载配置
export interface PreloadConfig {
  // 预加载策略
  strategy: 'eager' | 'lazy' | 'progressive';
  
  // 优先级配置
  priority: {
    critical: string[];    // 关键资源
    high: string[];       // 高优先级
    medium: string[];     // 中优先级
    low: string[];        // 低优先级
  };

  // 缓存配置
  cache: {
    enabled: boolean;
    maxAge: number;
    maxSize: number;
    strategy: 'LRU' | 'LFU' | 'FIFO';
  };

  // 网络配置
  network: {
    timeout: number;
    retries: number;
    concurrency: number;
    throttle: number;
  };
} 