/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const DesignTokens = {
  // 颜色令牌
  colors: {
    // 品牌色
    brand: {
      primary: '#2E7D32',
      secondary: '#0288D1',
      tertiary: '#9C27B0',
    },

    // 功能色
    functional: {
      success: '#43A047',
      warning: '#FFA000',
      error: '#D32F2F',
      info: '#1976D2',
    },

    // 中性色
    neutral: {
      white: '#FFFFFF',
      black: '#000000',
      gray: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
      },
    },
  },

  // 字体令牌
  typography: {
    // 字体家族
    families: {
      primary: 'PingFang SC',
      secondary: 'SF Pro Text',
      number: 'DIN Alternate',
    },

    // 字重
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    // 字号
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },

  // 间距令牌
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // 圆角令牌
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // 阴影令牌
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
  },
};
