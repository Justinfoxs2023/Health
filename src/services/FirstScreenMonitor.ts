export class FirstScreenMonitor {
  private static metrics = {
    firstPaint: 0,
    firstContentfulPaint: 0,
    firstMeaningfulPaint: 0,
    domContentLoaded: 0,
    loadComplete: 0
  };

  static init() {
    this.observePaints();
    this.observeLoading();
    this.observeResources();
  }

  private static observePaints() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.name) {
          case 'first-paint':
            this.metrics.firstPaint = entry.startTime;
            break;
          case 'first-contentful-paint':
            this.metrics.firstContentfulPaint = entry.startTime;
            break;
          case 'first-meaningful-paint':
            this.metrics.firstMeaningfulPaint = entry.startTime;
            break;
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }

  private static observeLoading() {
    document.addEventListener('DOMContentLoaded', () => {
      this.metrics.domContentLoaded = performance.now();
    });

    window.addEventListener('load', () => {
      this.metrics.loadComplete = performance.now();
      this.reportMetrics();
    });
  }

  private static reportMetrics() {
    console.log('首屏加载性能指标:', this.metrics);
    // TODO: 发送性能数据到分析服务
  }
} 