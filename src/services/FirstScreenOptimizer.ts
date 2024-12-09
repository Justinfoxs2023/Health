import { PerformanceOptimizer } from '@/utils/PerformanceOptimizer';

interface CriticalResource {
  type: 'script' | 'style' | 'image' | 'font';
  path: string;
  priority?: 'high' | 'medium' | 'low';
}

export class FirstScreenOptimizer {
  // 关键资源配置
  private static criticalResources: CriticalResource[] = [
    { type: 'script', path: '/js/main.chunk.js', priority: 'high' },
    { type: 'style', path: '/css/main.chunk.css', priority: 'high' },
    { type: 'image', path: '/images/logo.png', priority: 'high' },
    { type: 'font', path: '/fonts/main.woff2', priority: 'medium' }
  ];

  // 初始化优化
  static init() {
    this.preloadCriticalResources();
    this.optimizeImages();
    this.inlineStyles();
    this.deferNonCritical();
  }

  // 预加载关键资源
  private static preloadCriticalResources() {
    const head = document.head;
    
    this.criticalResources
      .filter(resource => resource.priority === 'high')
      .forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.type;
        link.href = resource.path;
        if (resource.type === 'font') {
          link.crossOrigin = 'anonymous';
        }
        head.appendChild(link);
      });
  }

  // 图片优化
  private static optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // 使用webp格式
      if (this.supportsWebP()) {
        const webpUrl = img.src.replace(/\.(png|jpg|jpeg)$/, '.webp');
        img.src = webpUrl;
      }
      
      // 懒加载
      if ('loading' in HTMLImageElement.prototype) {
        img.loading = 'lazy';
      }
      
      // 响应式图片
      if (!img.srcset && img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
  }

  // 内联关键CSS
  private static inlineStyles() {
    const criticalCSS = this.extractCriticalCSS();
    if (criticalCSS) {
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.appendChild(style);
    }
  }

  // 延迟非关键资源
  private static deferNonCritical() {
    // 延迟加载非关键JS
    const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
    nonCriticalScripts.forEach(script => {
      script.setAttribute('defer', '');
    });

    // 延迟加载非关键CSS
    const nonCriticalStyles = document.querySelectorAll('link[data-defer]');
    nonCriticalStyles.forEach(link => {
      link.media = 'print';
      link.onload = () => { link.media = 'all'; };
    });
  }

  // 提取关键CSS
  private static extractCriticalCSS(): string {
    // 实现关键CSS提取逻辑
    return `
      /* 关键CSS规则 */
      .header { /* ... */ }
      .nav { /* ... */ }
      .hero { /* ... */ }
    `;
  }

  // 检测webp支持
  private static supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }

  // 路由预加载
  static preloadRoutes(routes: string[]) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const route = entry.target.getAttribute('data-route');
          if (route) {
            this.prefetchRoute(route);
          }
        }
      });
    });

    // 监听路由链接
    document.querySelectorAll('[data-route]').forEach(el => {
      observer.observe(el);
    });
  }

  // 预取路由
  private static async prefetchRoute(route: string) {
    try {
      const module = await import(`@/pages${route}`);
      // 预取路由相关的数据
      if (module.prefetch) {
        await module.prefetch();
      }
    } catch (error) {
      console.error('路由预取失败:', error);
    }
  }

  // 组件预渲染
  static async preRenderComponents(components: string[]) {
    const preRenderedComponents = new Map();

    for (const component of components) {
      try {
        const module = await import(`@/components/${component}`);
        if (module.preRender) {
          const html = await module.preRender();
          preRenderedComponents.set(component, html);
        }
      } catch (error) {
        console.error(`组件预渲染失败: ${component}`, error);
      }
    }

    return preRenderedComponents;
  }
} 