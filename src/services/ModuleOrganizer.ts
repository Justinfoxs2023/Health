import { store } from '@/store';

interface ModuleConfig {
  name: string;
  components: string[];
  dependencies?: string[];
  preload?: boolean;
}

export class ModuleOrganizer {
  private static moduleConfigs: Record<string, ModuleConfig> = {
    dataVisualization: {
      name: '数据可视化',
      components: ['Charts', 'Trends', 'Reports'],
      preload: true
    },
    userInteraction: {
      name: '用户交互',
      components: ['Chat', 'Community', 'Consultation'],
      dependencies: ['dataVisualization']
    },
    healthManagement: {
      name: '健康管理',
      components: ['Tracking', 'Planning', 'Reminders'],
      dependencies: ['dataVisualization']
    },
    aiServices: {
      name: 'AI服务',
      components: ['ImageRecognition', 'HealthAssessment', 'Recommendations'],
      preload: true
    }
  };

  // 初始化模块
  static async initModules() {
    // 预加载标记为preload的模块
    const preloadModules = Object.entries(this.moduleConfigs)
      .filter(([_, config]) => config.preload)
      .map(([key]) => this.loadModule(key));

    await Promise.all(preloadModules);
  }

  // 加载模块
  static async loadModule(moduleName: string) {
    const config = this.moduleConfigs[moduleName];
    if (!config) return;

    // 加载依赖
    if (config.dependencies) {
      await Promise.all(
        config.dependencies.map(dep => this.loadModule(dep))
      );
    }

    // 加载组件
    await Promise.all(
      config.components.map(component => 
        import(`@/components/${moduleName}/${component}`)
      )
    );

    // 更新状态
    store.dispatch({
      type: 'modules/moduleLoaded',
      payload: moduleName
    });
  }

  // 获取模块状态
  static getModuleStatus(moduleName: string) {
    return store.getState().modules[moduleName];
  }
} 