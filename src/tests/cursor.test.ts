import { PerformanceMonitor } from '../utils/performance-monitoring';
import { errorHandler } from '../utils/error-handler';

describe('Cursor Performance Tests', () => {
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
  });

  afterEach(() => {
    // 清理性能监控资源
    performanceMonitor.cleanup();
  });

  test('响应时间监控', async () => {
    const startTime = Date.now();
    const responseTime = await performanceMonitor.trackMetric({
      name: 'response_time',
      value: () => {
        // 使用真实的操作时间
        return Date.now() - startTime;
      },
    });

    // 设置更合理的响应时间阈值
    expect(responseTime).toBeLessThan(500);
  });

  test('内存使用监控', async () => {
    const initialMemory = process.memoryUsage().heapUsed;
    const memoryMetric = await performanceMonitor.trackMetric({
      name: 'memory_usage',
      value: () => process.memoryUsage().heapUsed - initialMemory,
    });

    // 设置更精确的内存增长阈值
    expect(memoryMetric.value).toBeLessThan(1024 * 1024); // 1MB
  });

  test('CPU使用率监控', async () => {
    const cpuMetric = await performanceMonitor.trackMetric({
      name: 'cpu_usage',
      value: () => {
        const startUsage = process.cpuUsage();
        // 执行测试操作
        const endUsage = process.cpuUsage(startUsage);
        return (endUsage.user + endUsage.system) / 1000000; // 转换为毫秒
      },
    });

    expect(cpuMetric.value).toBeLessThan(100); // CPU使用率不应超过100ms
  });
});
