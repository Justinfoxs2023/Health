import { PerformanceConfig } from '../types/system-config';

export const ssrConfig = {
  // ISR配置
  isr: {
    // 需要ISR的页面路径
    paths: ['/health-data', '/analysis', '/community', '/expert'],
    // 重新生成间隔(秒)
    revalidateInterval: 3600,
    // 并发重新生成数量
    concurrentRevalidates: 5,
    // 失败重试次数
    maxRetries: 3,
  },

  // 预加载策略
  preload: {
    // 预加载的API路由
    apiRoutes: ['/api/user/profile', '/api/health/summary', '/api/community/trending'],
    // 预加载的组件
    components: ['Header', 'Footer', 'Sidebar', 'HealthDataCard'],
    // 预加载的数据
    data: ['userSettings', 'healthMetrics', 'recentActivities'],
  },

  // 性能优化配置
  performance: {
    // 压缩配置
    compression: {
      enabled: true,
      level: 6,
      threshold: 1024,
    },
    // 缓存配置
    cache: {
      enabled: true,
      duration: 3600,
      maxSize: 100 * 1024 * 1024, // 100MB
    },
    // 代码分割配置
    codeSplitting: {
      enabled: true,
      maxSize: 244 * 1024, // 244KB
    },
  },
} as const;

// 导出类型
export type SSRConfigType = typeof ssrConfig;
