declare module 'react-native' {
  import React from 'react';

  // 基础组件
  export interface ViewProps {
    style?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TextProps {
    style?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    style?: any;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    [key: string]: any;
  }

  export interface TouchableOpacityProps extends ViewProps {
    onPress?: () => void;
    activeOpacity?: number;
    disabled?: boolean;
  }

  export interface ImageProps {
    source: ImageSourcePropType;
    style?: any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
    [key: string]: any;
  }

  // 组件导出
  export const View: React.ComponentType<ViewProps>;
  export const Text: React.ComponentType<TextProps>;
  export const TextInput: React.ComponentType<TextInputProps>;
  export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>;
  export const Image: React.ComponentType<ImageProps>;
  export const SafeAreaView: React.ComponentType<ViewProps>;
  export const KeyboardAvoidingView: React.ComponentType<ViewProps>;
  export const ScrollView: React.ComponentType<ViewProps>;
  export const ActivityIndicator: React.ComponentType<ViewProps>;

  // 动画相关
  export namespace Animated {
    export class Value {
      constructor(value: number);
      setValue(value: number): void;
      setOffset(offset: number): void;
      interpolate(config: InterpolationConfigType): Animated.Value;
    }

    export interface InterpolationConfigType {
      inputRange: number[];
      outputRange: number[] | string[];
      easing?: (input: number) => number;
      extrapolate?: 'extend' | 'clamp' | 'identity';
    }

    export interface CompositeAnimation {
      start: (callback?: (finished: boolean) => void) => void;
      stop: () => void;
    }

    export function timing(
      value: Animated.Value,
      config: AnimationConfig
    ): CompositeAnimation;

    export function spring(
      value: Animated.Value,
      config: AnimationConfig
    ): CompositeAnimation;

    export function parallel(
      animations: CompositeAnimation[]
    ): CompositeAnimation;

    export function sequence(
      animations: CompositeAnimation[]
    ): CompositeAnimation;

    export function loop(
      animation: CompositeAnimation,
      config?: { iterations?: number }
    ): CompositeAnimation;

    export const View: React.ComponentType<ViewProps>;
    export const Text: React.ComponentType<TextProps>;
    export const Image: React.ComponentType<ImageProps>;
  }

  // 平台相关
  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    select: <T extends Record<string, any>>(config: T) => any;
    Version: number;
  };

  // 尺寸相关
  export const Dimensions: {
    get: (dimension: 'window' | 'screen') => ScaledSize;
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

  // 键盘相关
  export const Keyboard: {
    addListener: (
      eventName: 'keyboardDidShow' | 'keyboardDidHide' | 'keyboardWillShow' | 'keyboardWillHide',
      handler: (event: KeyboardEvent) => void
    ) => { remove: () => void };
    removeListener: (
      eventName: string,
      handler: (event: KeyboardEvent) => void
    ) => void;
    dismiss: () => void;
  };

  export interface KeyboardEvent {
    endCoordinates: {
      height: number;
      screenX: number;
      screenY: number;
      width: number;
    };
  }

  // 其他类型
  export type ImageSourcePropType = number | { uri: string } | { uri: string; width: number; height: number };
} 