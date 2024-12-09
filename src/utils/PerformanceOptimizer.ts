import { debounce, throttle } from 'lodash';

export class PerformanceOptimizer {
  // 图片优化
  static optimizeImage(url: string, options: { width?: number; quality?: number }) {
    const { width = 800, quality = 80 } = options;
    return `${url}?w=${width}&q=${quality}&auto=format`;
  }

  // 数据预加载
  static preloadData = async (keys: string[]) => {
    const preloadPromises = keys.map(key => {
      switch (key) {
        case 'userProfile':
          return import('@/data/userProfile');
        case 'healthMetrics':
          return import('@/data/healthMetrics');
        default:
          return Promise.resolve(null);
      }
    });

    try {
      await Promise.all(preloadPromises);
    } catch (error) {
      console.error('数据预加载失败:', error);
    }
  };

  // 渲染节流
  static throttleRender = throttle((callback: () => void) => {
    requestAnimationFrame(callback);
  }, 16);

  // 缓存管理
  static cacheManager = {
    set: (key: string, data: any, ttl: number) => {
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(key, JSON.stringify(item));
    },
    
    get: (key: string) => {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const { data, timestamp, ttl } = JSON.parse(item);
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    }
  };
} 