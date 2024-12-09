// 设计系统令牌类型定义
export interface DesignTokens {
  colors: {
    brand: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    background: {
      paper: string;
      default: string;
      secondary: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    functional: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    neutral: {
      white: string;
      black: string;
      gray: Record<string, string>;
    };
  };
  spacing: Record<string, number>;
  radius: Record<string, number>;
  typography: {
    sizes: Record<string, number>;
    weights: Record<string, number>;
  };
  shadows: Record<string, any>;
}

// 组件主题类型
export interface ComponentTheme {
  colors: DesignTokens['colors'];
  spacing: DesignTokens['spacing'];
  radius: DesignTokens['radius'];
  typography: DesignTokens['typography'];
  shadows: DesignTokens['shadows'];
}

// 主题配置类型
export interface ThemeConfig {
  mode: 'light' | 'dark';
  tokens: DesignTokens;
} 