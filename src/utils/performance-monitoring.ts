export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    responseTime: 0,
    memoryUsage: 0,
    fps: 0,
    loadTime: 0
  };

  // 监控响应时间
  measureResponseTime(callback: () => void): number {
    const start = performance.now();
    callback();
    const end = performance.now();
    this.metrics.responseTime = end - start;
    return this.metrics.responseTime;
  }

  // 监控内存使用
  measureMemoryUsage(): number {
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
    }
    return this.metrics.memoryUsage;
  }

  // 监控帧率
  measureFPS(): number {
    let frame = 0;
    let lastTime = performance.now();

    const calculateFPS = () => {
      frame++;
      const time = performance.now();
      if (time - lastTime > 1000) {
        this.metrics.fps = (frame * 1000) / (time - lastTime);
        frame = 0;
        lastTime = time;
      }
      requestAnimationFrame(calculateFPS);
    };

    calculateFPS();
    return this.metrics.fps;
  }
} 