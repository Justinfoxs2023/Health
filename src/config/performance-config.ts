export const performanceConfig = {
  // 动画性能优化
  animation: {
    willChange: 'transform',
    gpuAcceleration: true,
    throttle: {
      scroll: 16, // 60fps
      resize: 100
    }
  },

  // 资源加载优化
  resourceLoading: {
    lazyLoad: true,
    preload: ['critical-assets'],
    caching: {
      enabled: true,
      maxAge: 3600
    }
  },

  // 监控阈值
  thresholds: {
    responseTime: 100, // ms
    memoryUsage: 50 * 1024 * 1024, // 50MB
    minFPS: 30
  }
}; 