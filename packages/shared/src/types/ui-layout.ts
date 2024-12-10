// 界面布局配置
export interface UILayoutConfig {
  // 主题配置
  theme: {
    mode: 'light' | 'dark' | 'system';
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      accent: string[];
    };
    typography: {
      fontSize: {
        small: number;
        medium: number;
        large: number;
      };
      fontFamily: {
        regular: string;
        medium: string;
        bold: string;
      };
    };
  };

  // 布局配置
  layout: {
    // 快捷工具栏
    quickTools: {
      enabled: boolean;
      position: 'top' | 'bottom';
      maxItems: number;
      style: 'icon' | 'card' | 'list';
    };
    
    // 主要功能区
    mainContent: {
      style: 'grid' | 'list' | 'card';
      gridColumns: number;
      categorized: boolean;
      showLabels: boolean;
    };

    // 导航配置
    navigation: {
      style: 'tab' | 'drawer' | 'bottom';
      showIcons: boolean;
      showLabels: boolean;
      grouping: boolean;
    };

    // 搜索配置
    search: {
      position: 'top' | 'floating';
      style: 'simple' | 'advanced';
      showFilters: boolean;
      voiceEnabled: boolean;
    };
  };

  // 交互配置
  interaction: {
    animations: {
      enabled: boolean;
      duration: number;
      type: 'slide' | 'fade' | 'scale';
    };
    gestures: {
      swipe: boolean;
      pinch: boolean;
      longPress: boolean;
    };
    feedback: {
      haptic: boolean;
      sound: boolean;
      visual: boolean;
    };
  };
} 