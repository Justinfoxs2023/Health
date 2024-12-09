import { PlatformAdapter } from '../platform/PlatformAdapter';

export class ResponsiveLayout {
  // 断点定义
  static readonly breakpoints = {
    xs: 0,    // 手机竖屏
    sm: 600,  // 手机横屏
    md: 960,  // 平板竖屏
    lg: 1280, // 平板横屏/小屏桌面
    xl: 1920  // 大屏桌面
  };

  // 获取当前断点
  static getCurrentBreakpoint(): keyof typeof ResponsiveLayout.breakpoints {
    const width = PlatformAdapter.window.width;
    
    if (width >= this.breakpoints.xl) return 'xl';
    if (width >= this.breakpoints.lg) return 'lg';
    if (width >= this.breakpoints.md) return 'md';
    if (width >= this.breakpoints.sm) return 'sm';
    return 'xs';
  }

  // 响应式布局配置
  static getLayoutConfig<T>(config: {
    [K in keyof typeof ResponsiveLayout.breakpoints]?: T;
  } & { default: T }): T {
    const currentBreakpoint = this.getCurrentBreakpoint();
    return config[currentBreakpoint] || config.default;
  }

  // 获取网格列数
  static getGridColumns(): number {
    return this.getLayoutConfig({
      xs: 4,
      sm: 8,
      md: 12,
      lg: 12,
      xl: 12,
      default: 4
    });
  }

  // 获取容器边距
  static getContainerPadding(): number {
    return this.getLayoutConfig({
      xs: 16,
      sm: 24,
      md: 32,
      lg: 40,
      xl: 40,
      default: 16
    });
  }
} 