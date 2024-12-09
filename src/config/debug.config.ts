import { LogLevel } from '../types/debug';

export const debugConfig = {
  // 调试模式配置
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    verboseLogging: true,
    breakOnError: true,
    showDevTools: true,
  },

  // 日志配置
  logging: {
    level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
    console: {
      enabled: true,
      colorized: true,
      timestamp: true,
    },
    file: {
      enabled: true,
      path: 'logs/app.log',
      maxSize: '10m',
      maxFiles: 5,
    },
    performance: {
      enabled: true,
      slowQueryThreshold: 1000, // ms
      memoryWarningThreshold: 0.8, // 80%
    },
  },

  // API调试
  api: {
    mockEnabled: process.env.MOCK_API === 'true',
    delay: process.env.NODE_ENV === 'development' ? 1000 : 0,
    errorRate: process.env.NODE_ENV === 'development' ? 0.1 : 0,
  },

  // 性能监控
  monitoring: {
    enabled: true,
    metrics: {
      cpu: true,
      memory: true,
      requests: true,
      responses: true,
      errors: true,
    },
    sampling: {
      rate: 0.1,
      interval: 5000, // ms
    },
  },

  // 开发工具
  devTools: {
    redux: {
      enabled: process.env.NODE_ENV === 'development',
      maxAge: 50,
    },
    network: {
      enabled: true,
      includeHeaders: true,
      includeBodies: true,
      maxBodySize: 1000,
    },
    components: {
      enabled: true,
      highlightUpdates: true,
    },
  },

  // 错误追踪
  errorTracking: {
    enabled: true,
    captureUnhandledRejections: true,
    captureUncaughtExceptions: true,
    ignorePatterns: [
      /Failed to load resource/,
      /Loading chunk \d+ failed/,
    ],
    breadcrumbs: {
      enabled: true,
      maxBreadcrumbs: 100,
    },
  },

  // 性能分析
  profiling: {
    enabled: process.env.NODE_ENV === 'development',
    flamegraph: {
      enabled: true,
      samplingInterval: 1000,
    },
    memoryHeapSnapshots: {
      enabled: true,
      maxSnapshots: 3,
    },
  },
}; 