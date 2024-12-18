/**
 * @fileoverview TS 文件 api.d.ts 的功能描述
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
  export interface ScaledSize {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  }

  export const Dimensions: {
    get: (dimension: 'window' | 'screen') => ScaledSize;
    addEventListener: (type: string, handler: Function) => void;
    removeEventListener: (type: string, handler: Function) => void;
  };

  // StyleSheet API
  export const StyleSheet: {
    create: <T extends { [key: string]: any }>(styles: T) => T;
    flatten: (style: any) => { [key: string]: any };
  };

  // Keyboard API
  export interface KeyboardEvent {
    endCoordinates: {
      height: number;
      screenX: number;
      screenY: number;
      width: number;
    };
  }

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

  // Types
  export type ImageSourcePropType =
    | number
    | { uri: string }
    | { uri: string; width: number; height: number };
}
