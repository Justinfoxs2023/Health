import { ColorTokens } from './colorTokens';

export type ThemeType = 'vibrant' | 'soft' | 'professional';

export interface ThemeConfig {
  type: ThemeType;
  isDark: boolean;
}

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemeConfig = {
    type: 'vibrant',
    isDark: false
  };

  private constructor() {}

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  getThemeColors() {
    const baseColors = ColorTokens[this.currentTheme.type];
    const darkModeModifier = this.currentTheme.isDark ? 0.8 : 1;

    return {
      ...baseColors,
      // 调整暗色模式下的颜色
      primary: {
        ...baseColors.primary,
        main: this.adjustColorBrightness(baseColors.primary.main, darkModeModifier)
      },
      secondary: {
        ...baseColors.secondary,
        main: this.adjustColorBrightness(baseColors.secondary.main, darkModeModifier)
      }
    };
  }

  private adjustColorBrightness(hexColor: string, modifier: number): string {
    // 实现颜色亮度调整逻辑
    return hexColor; // 简化版本
  }

  setTheme(config: Partial<ThemeConfig>) {
    this.currentTheme = {
      ...this.currentTheme,
      ...config
    };
  }
} 