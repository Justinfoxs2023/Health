import { useState, useEffect } from 'react';

import { BehaviorSubject } from 'rxjs';

/** 主题类型 */
export type ThemeModeType = 'light' | 'dark' | 'system';

/** 主题配置 */
export interface IThemeConfig {
  /** 主色调 */
  primaryColor: string;
  /** 次要色调 */
  secondaryColor: string;
  /** 背景色 */
  backgroundColor: string;
  /** 文本色 */
  textColor: string;
  /** 字体大小 */
  fontSize: {
    small: string;
    medium: string;
    large: string;
  };
  /** 间距 */
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  /** 边框圆角 */
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  /** 阴影 */
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

/** 默认主题配置 */
const defaultConfig: IThemeConfig = {
  primaryColor: '#1890ff',
  secondaryColor: '#52c41a',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  fontSize: {
    small: '12px',
    medium: '14px',
    large: '16px',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: {
    small: '2px',
    medium: '4px',
    large: '8px',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)',
  },
};

/** 主题管理服务 */
class ThemeService {
  private mode$ = new BehaviorSubject<ThemeModeType>('system');
  private config$ = new BehaviorSubject<IThemeConfig>(defaultConfig);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    // 从localStorage读取主题设置
    const savedMode = localStorage.getItem('themeMode') as ThemeModeType;
    if (savedMode) {
      this.setMode(savedMode);
    }

    // 从localStorage读取主题配置
    const savedConfig = localStorage.getItem('themeConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        this.setConfig(config);
      } catch (error) {
        console.error('Error in index.ts:', 'Failed to parse theme config:', error);
      }
    }

    // 监听系统主题变化
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', this.handleSystemThemeChange);
    }
  }

  private handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (this.mode$.value === 'system') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  };

  /** 获取当前主题模式 */
  public getMode(): ThemeModeType {
    return this.mode$.value;
  }

  /** 获取当前主题配置 */
  public getConfig(): IThemeConfig {
    return this.config$.value;
  }

  /** 设置主题模式 */
  public setMode(mode: ThemeModeType): void {
    this.mode$.next(mode);
    localStorage.setItem('themeMode', mode);

    if (mode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', mode);
    }

    // 触发自定义事件
    window.dispatchEvent(
      new CustomEvent('themechange', {
        detail: {
          mode: this.mode$.value,
          config: this.config$.value,
        },
      }),
    );
  }

  /** 设置主题配置 */
  public setConfig(config: Partial<IThemeConfig>): void {
    const newConfig = {
      ...this.config$.value,
      ...config,
    };
    this.config$.next(newConfig);
    localStorage.setItem('themeConfig', JSON.stringify(newConfig));

    // 应用主题配置
    Object.entries(newConfig).forEach(([key, value]) => {
      if (typeof value === 'string') {
        document.documentElement.style.setProperty(`--theme-${key}`, value);
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          document.documentElement.style.setProperty(
            `--theme-${key}-${subKey}`,
            subValue as string,
          );
        });
      }
    });

    // 触发自定义事件
    window.dispatchEvent(
      new CustomEvent('themechange', {
        detail: {
          mode: this.mode$.value,
          config: newConfig,
        },
      }),
    );
  }

  /** 销毁实例 */
  public destroy(): void {
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', this.handleSystemThemeChange);
    }
  }
}

/** 主题管理服务实例 */
export const themeService = new ThemeService();

/** 主题Hook */
export function useTheme(): {
  mode: 'light' | 'dark' | 'system';
  config: import('D:/Health/packages/shared/src/services/theme/index').IThemeConfig;
  setMode: (
    mode: import('D:/Health/packages/shared/src/services/theme/index').ThemeModeType,
  ) => void;
  setConfig: (
    config: Partial<import('D:/Health/packages/shared/src/services/theme/index').IThemeConfig>,
  ) => void;
} {
  const [mode, setMode] = useState(themeService.getMode());
  const [config, setConfig] = useState(themeService.getConfig());

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setMode(e.detail.mode);
      setConfig(e.detail.config);
    };

    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);

  return {
    mode,
    config,
    setMode: themeService.setMode.bind(themeService),
    setConfig: themeService.setConfig.bind(themeService),
  };
}
