/**
 * @fileoverview TS 文件 health-theme.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const healthTheme = {
  colors: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#1565C0',
      contrast: '#FFFFFF',
    },
    status: {
      success: '#43A047',
      warning: '#FFA000',
      error: '#D32F2F',
      info: '#1976D2',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
      card: '#FAFAFA',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Noto Sans SC', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    // ... 其他排版样式
  },
  spacing: {
    unit: 8,
    container: 24,
    card: 16,
  },
};
