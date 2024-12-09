declare module 'react-native' {
  // 导航相关
  export interface NavigationEvent {
    target: number;
    data?: any;
  }

  // 手势相关
  export interface GestureResponderHandlers {
    onStartShouldSetResponder?: (event: GestureResponderEvent) => boolean;
    onMoveShouldSetResponder?: (event: GestureResponderEvent) => boolean;
    onResponderGrant?: (event: GestureResponderEvent) => void;
    onResponderMove?: (event: GestureResponderEvent) => void;
    onResponderRelease?: (event: GestureResponderEvent) => void;
    onResponderTerminate?: (event: GestureResponderEvent) => void;
    onResponderTerminationRequest?: (event: GestureResponderEvent) => boolean;
  }

  // 布局相关
  export interface LayoutChangeEvent {
    nativeEvent: {
      layout: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    };
  }

  export interface LayoutRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  // 动画相关扩展
  export namespace Animated {
    export interface AnimatedInterpolation {
      interpolate(config: InterpolationConfigType): AnimatedInterpolation;
    }

    export interface DecayAnimationConfig {
      velocity: number | { x: number; y: number };
      deceleration?: number;
      useNativeDriver?: boolean;
    }

    export interface SpringAnimationConfig {
      toValue: number | AnimatedValue | { x: number; y: number };
      overshootClamping?: boolean;
      restDisplacementThreshold?: number;
      restSpeedThreshold?: number;
      velocity?: number | { x: number; y: number };
      bounciness?: number;
      speed?: number;
      tension?: number;
      friction?: number;
      stiffness?: number;
      damping?: number;
      mass?: number;
      delay?: number;
      useNativeDriver?: boolean;
    }

    export function decay(
      value: AnimatedValue,
      config: DecayAnimationConfig
    ): CompositeAnimation;

    export function add(
      a: Animated.Value | Animated.AnimatedInterpolation,
      b: Animated.Value | Animated.AnimatedInterpolation
    ): Animated.AnimatedInterpolation;

    export function multiply(
      a: Animated.Value | Animated.AnimatedInterpolation,
      b: Animated.Value | Animated.AnimatedInterpolation
    ): Animated.AnimatedInterpolation;

    export function divide(
      a: Animated.Value | Animated.AnimatedInterpolation,
      b: Animated.Value | Animated.AnimatedInterpolation
    ): Animated.AnimatedInterpolation;

    export function modulo(
      a: Animated.Value,
      modulus: number
    ): Animated.AnimatedInterpolation;

    export function diffClamp(
      a: Animated.Value,
      min: number,
      max: number
    ): Animated.AnimatedInterpolation;
  }

  // 平台特定API
  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    Version: number | string;
    isPad: boolean;
    isTVOS: boolean;
    isTV: boolean;
    select: <T extends Record<string, any>>(config: {
      ios?: T;
      android?: T;
      native?: T;
      default?: T;
      web?: T;
      windows?: T;
      macos?: T;
    }) => T;
  };

  // 设备信息
  export interface Dimensions {
    window: ScaledSize;
    screen: ScaledSize;
  }

  export interface ScaledSize {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  }

  // 声音相关
  export class Sound {
    static MAIN_BUNDLE: number;
    static DOCUMENT: number;
    static LIBRARY: number;
    static CACHES: number;

    constructor(
      filename: string,
      basePath: number,
      error: (error: any) => void,
      options?: { allowBackground?: boolean }
    );

    play: (onComplete?: (success: boolean) => void) => void;
    pause: () => void;
    stop: () => void;
    release: () => void;
    getDuration: () => number;
    setVolume: (value: number) => void;
    setNumberOfLoops: (value: number) => void;
    setSpeed: (value: number) => void;
    setPan: (value: number) => void;
    getCurrentTime: (callback: (seconds: number) => void) => void;
    setCurrentTime: (value: number) => void;
  }
} 