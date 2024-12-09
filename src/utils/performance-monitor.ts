export class PerformanceMonitor {
  static init() {
    // 页面加载性能
    window.addEventListener('load', () => {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`页面加载时间: ${loadTime}ms`);
    });

    // 组件渲染性能
    if (process.env.NODE_ENV === 'development') {
      const measures: {[key: string]: number} = {};
      
      const originalComponentDidMount = React.Component.prototype.componentDidMount;
      const originalComponentDidUpdate = React.Component.prototype.componentDidUpdate;

      React.Component.prototype.componentDidMount = function() {
        const start = performance.now();
        originalComponentDidMount?.apply(this);
        measures[this.constructor.name] = performance.now() - start;
      };

      React.Component.prototype.componentDidUpdate = function() {
        const start = performance.now();
        originalComponentDidUpdate?.apply(this);
        measures[this.constructor.name] = performance.now() - start;
      };
    }
  }
} 