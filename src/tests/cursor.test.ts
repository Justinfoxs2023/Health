import { PerformanceMonitor } from '../utils/performance-monitoring';
import { errorHandler } from '../utils/error-handling';

describe('Cursor Performance Tests', () => {
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
  });

  test('响应时间监控', () => {
    const responseTime = performanceMonitor.measureResponseTime(() => {
      // 模拟操作
      for (let i = 0; i < 1000; i++) {}
    });
    expect(responseTime).toBeLessThan(100);
  });

  test('内存使用监控', () => {
    const memoryUsage = performanceMonitor.measureMemoryUsage();
    expect(memoryUsage).toBeLessThan(50 * 1024 * 1024);
  });

  test('错误处理', () => {
    const error = new Error('测试错误');
    const handling = errorHandler.handleInteractionError(error);
    expect(handling.fallback).toBeDefined();
    expect(handling.recovery).toBeDefined();
  });
}); 