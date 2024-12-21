/**
 * @fileoverview TS 文件 interaction-helpers.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 交互助手函数
export const interactionHelpers = {
  // 防抖函数
  debounce: (fn: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  // 节流函数
  throttle: (fn: Function, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // 性能优化包装器
  withPerformanceTracking: (fn: Function, monitor: PerformanceMonitor) => {
    return (...args: any[]) => {
      const responseTime = monitor.measureResponseTime(() => fn(...args));
      if (responseTime > performanceConfig.thresholds.responseTime) {
        console.warn(`性能警告: 响应时间 ${responseTime}ms 超过阈值`);
      }
      return responseTime;
    };
  },
};
