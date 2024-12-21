import { Platform, Keyboard, KeyboardEvent } from 'react-native';
import { PlatformAdapter } from '../platform/PlatformAdapter';

export class KeyboardManager {
  private static listeners: Array<(visible: boolean) => void> = [];

  // 初始化键盘管理器
  static init() {
    if (PlatformAdapter.isMobile) {
      Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
    }
  }

  // 添加键盘状态监听器
  static addListener(callback: (visible: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // 处理键盘显示
  private static handleKeyboardShow(event: KeyboardEvent) {
    const keyboardHeight = event.endCoordinates.height;
    this.listeners.forEach(listener => listener(true));
  }

  // 处理键盘隐藏
  private static handleKeyboardHide() {
    this.listeners.forEach(listener => listener(false));
  }

  // 主动隐藏键盘
  static dismiss() {
    if (PlatformAdapter.isMobile) {
      Keyboard.dismiss();
    }
  }

  // 获取键盘行为配置
  static getKeyboardConfig() {
    return PlatformAdapter.select({
      ios: {
        behavior: 'padding',
        enabled: true,
      },
      android: {
        behavior: 'height',
        enabled: true,
      },
      default: {
        enabled: false,
      },
    });
  }
}
