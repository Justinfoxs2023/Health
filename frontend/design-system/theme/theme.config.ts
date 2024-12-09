import { DesignTokens } from '../tokens';

export const ThemeConfig = {
  // 主题模式配置
  modes: {
    light: {
      background: {
        primary: DesignTokens.colors.neutral.white,
        secondary: DesignTokens.colors.neutral.gray[50],
        tertiary: DesignTokens.colors.neutral.gray[100]
      },
      text: {
        primary: DesignTokens.colors.neutral.gray[900],
        secondary: DesignTokens.colors.neutral.gray[600],
        tertiary: DesignTokens.colors.neutral.gray[400]
      }
    },
    dark: {
      background: {
        primary: DesignTokens.colors.neutral.gray[900],
        secondary: DesignTokens.colors.neutral.gray[800],
        tertiary: DesignTokens.colors.neutral.gray[700]
      },
      text: {
        primary: DesignTokens.colors.neutral.white,
        secondary: DesignTokens.colors.neutral.gray[300],
        tertiary: DesignTokens.colors.neutral.gray[500]
      }
    }
  },

  // 响应式断点配置
  breakpoints: {
    xs: 0,    // 手机竖屏
    sm: 600,  // 手机横屏
    md: 960,  // 平板竖屏
    lg: 1280, // 平板横屏/桌面
    xl: 1920  // 大屏设备
  },

  // 布局配置
  layout: {
    maxWidth: 1200,
    containerPadding: {
      xs: DesignTokens.spacing.md,
      sm: DesignTokens.spacing.lg,
      md: DesignTokens.spacing.xl,
      lg: DesignTokens.spacing.xxl
    }
  },

  // 动画配置
  animation: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    }
  }
}; 