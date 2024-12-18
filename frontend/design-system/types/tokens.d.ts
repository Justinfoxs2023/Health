/**
 * @fileoverview TS 文件 tokens.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 设计系统令牌类型定义
export interface IDesignTokens {
  /** colors 的描述 */
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
  /** spacing 的描述 */
  spacing: Record<string, number>;
  /** radius 的描述 */
  radius: Record<string, number>;
  /** typography 的描述 */
  typography: {
    sizes: Record<string, number>;
    weights: Record<string, number>;
  };
  /** shadows 的描述 */
  shadows: Record<string, any>;
}

// 组件主题类型
export interface IComponentTheme {
  /** colors 的描述 */
  colors: IDesignTokens['colors'];
  /** spacing 的描述 */
  spacing: IDesignTokens['spacing'];
  /** radius 的描述 */
  radius: IDesignTokens['radius'];
  /** typography 的描述 */
  typography: IDesignTokens['typography'];
  /** shadows 的描述 */
  shadows: IDesignTokens['shadows'];
}

// 主题配置类型
export interface IThemeConfig {
  /** mode 的描述 */
  mode: 'light' | 'dark';
  /** tokens 的描述 */
  tokens: IDesignTokens;
}
