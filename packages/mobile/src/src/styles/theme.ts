export const theme = {
  colors: {
    // 主色调
    primary: {
      light: '#4CAF50',
      main: '#2E7D32',
      dark: '#1B5E20',
      contrast: '#FFFFFF'
    },
    // 辅助色
    secondary: {
      light: '#03A9F4',
      main: '#0288D1',
      dark: '#01579B',
      contrast: '#FFFFFF'
    },
    // 背景色
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
      gradient: ['#E8F5E9', '#F1F8E9']
    },
    // 文字颜色
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
      hint: '#BDBDBD'
    },
    // 状态颜色
    status: {
      success: '#43A047',
      error: '#D32F2F',
      warning: '#FFA000',
      info: '#1976D2'
    }
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32
    },
    body1: {
      fontSize: 16,
      lineHeight: 24
    },
    body2: {
      fontSize: 14,
      lineHeight: 20
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      textTransform: 'none'
    }
  },
  
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)'
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24
  }
}; 