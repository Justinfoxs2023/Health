import { Platform, Dimensions, ScaledSize } from 'react-native';

export class PlatformAdapter {
  // 平台类型
  static readonly platform = Platform.OS;
  
  // 设备类型判断
  static readonly isWeb = Platform.OS === 'web';
  static readonly isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  static readonly isDesktop = Platform.OS === 'windows' || Platform.OS === 'macos';
  
  // 屏幕尺寸
  static readonly window: ScaledSize = Dimensions.get('window');
  
  // 设备类型判断
  static readonly isTablet = (
    this.window.width >= 768 && this.window.height >= 768
  );
  
  // 获取平台特定值
  static select<T>(config: {
    ios?: T;
    android?: T;
    web?: T;
    windows?: T;
    macos?: T;
    default: T;
  }): T {
    return config[Platform.OS] || config.default;
  }

  // 获取设备类型特定值
  static selectByDevice<T>(config: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    default: T;
  }): T {
    if (this.isMobile && !this.isTablet) return config.mobile || config.default;
    if (this.isTablet) return config.tablet || config.default;
    if (this.isDesktop) return config.desktop || config.default;
    return config.default;
  }
} 