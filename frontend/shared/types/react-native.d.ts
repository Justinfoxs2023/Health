declare module 'react-native' {
  import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

  export interface Platform {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    Version: number;
    select<T>(config: { [platform: string]: T }): T;
  }

  export interface Dimensions {
    get(dimension: 'window' | 'screen'): {
      width: number;
      height: number;
      scale: number;
      fontScale: number;
    };
  }

  export interface AsyncStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<string[]>;
    remove(key: string): Promise<void>;
  }

  export const Platform: Platform;
  export const Dimensions: Dimensions;
  export const AsyncStorage: AsyncStorage;
  export const useWindowDimensions: () => { width: number; height: number };
} 