/**
 * @fileoverview TS 文件 base.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 设计系统基础类型
export interface IDesignSystem {
  /** colors 的描述 */
  colors: IColorTokens;
  /** typography 的描述 */
  typography: ITypographyTokens;
  /** spacing 的描述 */
  spacing: ISpacingTokens;
  /** radius 的描述 */
  radius: IRadiusTokens;
  /** shadows 的描述 */
  shadows: IShadowTokens;
  /** animation 的描述 */
  animation: IAnimationTokens;
}

// 颜色令牌
export interface IColorTokens {
  /** brand 的描述 */
  brand: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  /** background 的描述 */
  background: {
    paper: string;
    default: string;
    secondary: string;
  };
  /** text 的描述 */
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  /** functional 的描述 */
  functional: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  /** neutral 的描述 */
  neutral: {
    white: string;
    black: string;
    gray: Record<string, string>;
  };
}

// 排版令牌
export interface ITypographyTokens {
  /** sizes 的描述 */
  sizes: Record<string, number>;
  /** weights 的描述 */
  weights: Record<string, number>;
  /** lineHeights 的描述 */
  lineHeights: Record<string, number>;
  /** families 的描述 */
  families: {
    primary: string;
    secondary: string;
  };
}

// 间距令牌
export interface ISpacingTokens {
  /** xs 的描述 */
  xs: number;
  /** sm 的描述 */
  sm: number;
  /** md 的描述 */
  md: number;
  /** lg 的描述 */
  lg: number;
  /** xl 的描述 */
  xl: number;
  /** xxl 的描述 */
  xxl: number;
}

// 圆角令牌
export interface IRadiusTokens {
  /** none 的描述 */
  none: number;
  /** xs 的描述 */
  xs: number;
  /** sm 的描述 */
  sm: number;
  /** md 的描述 */
  md: number;
  /** lg 的描述 */
  lg: number;
  /** xl 的描述 */
  xl: number;
  /** full 的描述 */
  full: number;
}

// 阴影令牌
export interface IShadowTokens {
  /** none 的描述 */
  none: any;
  /** sm 的描述 */
  sm: IShadowToken;
  /** md 的描述 */
  md: IShadowToken;
  /** lg 的描述 */
  lg: IShadowToken;
  /** xl 的描述 */
  xl: IShadowToken;
}

export interface IShadowToken {
  /** shadowColor 的描述 */
  shadowColor: string;
  /** shadowOffset 的描述 */
  shadowOffset: {
    width: number;
    height: number;
  };
  /** shadowOpacity 的描述 */
  shadowOpacity: number;
  /** shadowRadius 的描述 */
  shadowRadius: number;
  /** elevation 的描述 */
  elevation: number;
}

// 动画令牌
export interface IAnimationTokens {
  /** duration 的描述 */
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  /** easing 的描述 */
  easing: {
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}
