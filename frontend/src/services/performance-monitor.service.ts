export class PerformanceMonitorService {
  private metrics: {
    [key: string]: number[];
  } = {};

  startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name).pop();
    if (measure) {
      if (!this.metrics[name]) {
        this.metrics[name] = [];
      }
      this.metrics[name].push(measure.duration);
    }

    // 清理标记
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
  }

  getMetrics(name: string) {
    const measurements = this.metrics[name] || [];
    if (measurements.length === 0) return null;

    return {
      average: measurements.reduce((a, b) => a + b, 0) / measurements.length,
      min: Math.min(...measurements),
      max: Math.max(...measurements),
      count: measurements.length
    };
  }
} 