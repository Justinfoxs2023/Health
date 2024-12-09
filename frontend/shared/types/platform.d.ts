declare module 'react-native' {
  export interface PlatformOSType {
    ios: string;
    android: string;
    web: string;
    windows: string;
    macos: string;
  }

  export interface PlatformSelectSpec<T> {
    ios?: T;
    android?: T;
    native?: T;
    default?: T;
    web?: T;
    windows?: T;
    macos?: T;
  }

  export const Platform: {
    OS: keyof PlatformOSType;
    Version: number | string;
    isTV: boolean;
    isTesting: boolean;
    select: <T>(spec: PlatformSelectSpec<T>) => T;
  };

  export const Dimensions: {
    get: (dimension: 'window' | 'screen') => ScaledSize;
    set: (dimensions: { [key: string]: ScaledSize }) => void;
    addEventListener: (
      type: 'change',
      handler: (dims: { window: ScaledSize; screen: ScaledSize }) => void
    ) => void;
    removeEventListener: (
      type: 'change',
      handler: (dims: { window: ScaledSize; screen: ScaledSize }) => void
    ) => void;
  };

  export interface ScaledSize {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  }
} 