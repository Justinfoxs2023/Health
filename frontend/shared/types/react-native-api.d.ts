/**
 * @fileoverview TS 文件 react-native-api.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'react-native' {
  // Platform API
  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    select: <T extends Record<string, any>>(config: T) => any;
    Version: number;
  };

  // Dimensions API
  export const Dimensions: {
    get: (dimension: 'window' | 'screen') => { width: number; height: number };
    addEventListener: (type: string, handler: Function) => void;
    removeEventListener: (type: string, handler: Function) => void;
  };

  // Animated API
  export const Animated: {
    Value: typeof AnimatedValue;
    timing: (
      value: AnimatedValue,
      config: AnimatedTimingConfig,
    ) => {
      start: (callback?: (result: { finished: boolean }) => void) => void;
    };
    spring: (
      value: AnimatedValue,
      config: AnimatedSpringConfig,
    ) => {
      start: (callback?: (result: { finished: boolean }) => void) => void;
    };
    View: React.ComponentType<ViewProps>;
    Text: React.ComponentType<TextProps>;
    Image: React.ComponentType<ImageProps>;
  };

  // Keyboard API
  export const Keyboard: {
    addListener: (
      eventName: string,
      callback: (event: KeyboardEvent) => void,
    ) => { remove: () => void };
    removeListener: (eventName: string, callback: Function) => void;
    dismiss: () => void;
  };

  // Alert API
  export const Alert: {
    alert: (
      title: string,
      message?: string,
      buttons?: Array<{
        text?: string;
        onPress?: () => void;
        style?: 'default' | 'cancel' | 'destructive';
      }>,
      options?: { cancelable?: boolean },
    ) => void;
  };

  // StyleSheet API
  export const StyleSheet: {
    create: <T extends { [key: string]: any }>(styles: T) => T;
    flatten: (style: any) => { [key: string]: any };
  };
}
