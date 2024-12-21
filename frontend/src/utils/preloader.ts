import { ssrConfig } from '../config/ssr.config';

import { logger } from '@/services/logger';

class Preloader {
  private static loadedResources = new Set<string>();
  private static preloadQueue: string[] = [];
  private static isPreloading = false;

  /**
   * 初始化预加载
   */
  static init() {
    // 预加载API路由
    this.preloadApiRoutes();
    // 预加载组件
    this.preloadComponents();
    // 预加载数据
    this.preloadData();
    // 监听路由变化
    this.observeRouteChanges();
  }

  /**
   * 预加载API路由
   */
  private static async preloadApiRoutes() {
    const routes = ssrConfig.preload.apiRoutes;

    for (const route of routes) {
      if (this.loadedResources.has(route)) continue;

      try {
        const response = await fetch(route, {
          method: 'HEAD',
          credentials: 'include',
        });

        if (response.ok) {
          this.loadedResources.add(route);
        }
      } catch (error) {
        logger.error('API路由预加载失败:', { route, error });
      }
    }
  }

  /**
   * 预加载组件
   */
  private static async preloadComponents() {
    const components = ssrConfig.preload.components;

    for (const component of components) {
      if (this.loadedResources.has(`component:${component}`)) continue;

      try {
        await import(`@/components/${component}`);
        this.loadedResources.add(`component:${component}`);
      } catch (error) {
        logger.error('组件预加载失败:', { component, error });
      }
    }
  }

  /**
   * 预加载数据
   */
  private static async preloadData() {
    const dataKeys = ssrConfig.preload.data;

    for (const key of dataKeys) {
      if (this.loadedResources.has(`data:${key}`)) continue;

      try {
        await import(`@/data/${key}`);
        this.loadedResources.add(`data:${key}`);
      } catch (error) {
        logger.error('数据预加载失败:', { key, error });
      }
    }
  }

  /**
   * 监听路由变化
   */
  private static observeRouteChanges() {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            if (link.href && !this.loadedResources.has(link.href)) {
              this.queuePreload(link.href);
            }
          }
        });
      },
      { rootMargin: '50px' },
    );

    // 观察所有链接
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      observer.observe(link);
    });
  }

  /**
   * 将资源添加到预加载队列
   */
  private static queuePreload(resource: string) {
    if (!this.preloadQueue.includes(resource)) {
      this.preloadQueue.push(resource);
      this.processQueue();
    }
  }

  /**
   * 处理预加载队列
   */
  private static async processQueue() {
    if (this.isPreloading || this.preloadQueue.length === 0) return;

    this.isPreloading = true;
    const resource = this.preloadQueue.shift()!;

    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
      this.loadedResources.add(resource);
    } catch (error) {
      logger.error('资源预加载失败:', { resource, error });
    } finally {
      this.isPreloading = false;
      if (this.preloadQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  /**
   * 获取预加载状态
   */
  static getStatus() {
    return {
      loadedCount: this.loadedResources.size,
      queueLength: this.preloadQueue.length,
      loadedResources: Array.from(this.loadedResources),
      pendingResources: [...this.preloadQueue],
    };
  }
}
