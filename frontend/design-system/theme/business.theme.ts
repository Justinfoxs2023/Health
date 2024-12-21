import { DesignTokens } from '../tokens';

export const BusinessTheme = {
  // 健康数据相关配色
  healthMetrics: {
    heartRate: {
      primary: '#FF5252',
      secondary: '#FFCDD2',
      gradient: ['#FF8A80', '#FF5252'],
    },
    bloodPressure: {
      primary: '#536DFE',
      secondary: '#C5CAE9',
      gradient: ['#8C9EFF', '#536DFE'],
    },
    bloodOxygen: {
      primary: '#00BCD4',
      secondary: '#B2EBF2',
      gradient: ['#84FFFF', '#00BCD4'],
    },
    weight: {
      primary: '#4CAF50',
      secondary: '#C8E6C9',
      gradient: ['#69F0AE', '#4CAF50'],
    },
  },

  // 状态样式
  statusStyles: {
    normal: {
      color: DesignTokens.colors.functional.success,
      background: `${DesignTokens.colors.functional.success}10`,
      icon: 'check-circle',
    },
    warning: {
      color: DesignTokens.colors.functional.warning,
      background: `${DesignTokens.colors.functional.warning}10`,
      icon: 'alert-triangle',
    },
    alert: {
      color: DesignTokens.colors.functional.error,
      background: `${DesignTokens.colors.functional.error}10`,
      icon: 'alert-circle',
    },
  },

  // 卡片样式
  cardStyles: {
    default: {
      borderRadius: DesignTokens.radius.lg,
      padding: DesignTokens.spacing.lg,
      backgroundColor: DesignTokens.colors.neutral.white,
      ...DesignTokens.shadows.md,
    },
    highlighted: {
      borderRadius: DesignTokens.radius.lg,
      padding: DesignTokens.spacing.lg,
      backgroundColor: DesignTokens.colors.neutral.white,
      borderLeftWidth: 4,
      ...DesignTokens.shadows.lg,
    },
  },

  // 图表样式
  chartStyles: {
    colors: ['#2E7D32', '#1976D2', '#FFA000', '#D32F2F', '#7B1FA2'],
    grid: {
      color: DesignTokens.colors.neutral.gray[200],
      width: 1,
    },
    tooltip: {
      backgroundColor: DesignTokens.colors.neutral.gray[900],
      textColor: DesignTokens.colors.neutral.white,
      borderRadius: DesignTokens.radius.sm,
    },
  },
};
