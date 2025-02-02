type ComponentType = React.ComponentType<any>;

interface ComponentRegistry {
  [key: string]: {
    component: ComponentType;
    preload?: boolean;
    dependencies?: string[];
  };
}

export class PageComponentRegistry {
  private static registry: ComponentRegistry = {};

  // 注册组件
  static register(name: string, component: ComponentType, options = {}) {
    this.registry[name] = {
      component,
      ...options
    };
  }

  // 获取组件
  static getComponent(name: string): ComponentType | null {
    return this.registry[name]?.component || null;
  }

  // 预加载组件
  static async preloadComponents() {
    const preloadComponents = Object.entries(this.registry)
      .filter(([_, config]) => config.preload)
      .map(([name, config]) => {
        if (config.dependencies) {
          return Promise.all([
            ...config.dependencies.map(dep => this.getComponent(dep)),
            config.component
          ]);
        }
        return Promise.resolve(config.component);
      });

    await Promise.all(preloadComponents);
  }
}

// 注册核心组件
PageComponentRegistry.register('VitalsDisplay', lazy(() => import('@/components/health/VitalsDisplay')), { preload: true });
PageComponentRegistry.register('HealthMetrics', lazy(() => import('@/components/health/HealthMetrics')), { preload: true });
PageComponentRegistry.register('AlertPanel', lazy(() => import('@/components/health/AlertPanel')));
// ... 注册其他组件 