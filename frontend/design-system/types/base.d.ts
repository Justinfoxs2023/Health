// 设计系统基础类型
export interface DesignSystem {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  animation: AnimationTokens;
}

// 颜色令牌
export interface ColorTokens {
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
}

// 排版令牌
export interface TypographyTokens {
  sizes: Record<string, number>;
  weights: Record<string, number>;
  lineHeights: Record<string, number>;
  families: {
    primary: string;
    secondary: string;
  };
}

// 间距令牌
export interface SpacingTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

// 圆角令牌
export interface RadiusTokens {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

// 阴影令牌
export interface ShadowTokens {
  none: any;
  sm: ShadowToken;
  md: ShadowToken;
  lg: ShadowToken;
  xl: ShadowToken;
}

export interface ShadowToken {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// 动画令牌
export interface AnimationTokens {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
} 