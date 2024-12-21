import React from 'react';

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

declare module 'react-native' {
  // 基础组件类型
  export interface ViewProps {
    style?: ViewStyle | ViewStyle[];
    children?: React.ReactNode;
  }

  export interface TextProps {
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
  }

  // 动画相关类型
  export namespace Animated {
    export class Value {
      constructor(value: number);
      setValue(value: number): void;
      setOffset(offset: number): void;
      interpolate(config: InterpolationConfigType): Value;
    }

    export interface CompositeAnimation {
      start(callback?: (finished: boolean) => void): void;
      stop(): void;
    }

    export function timing(value: Value, config: AnimationConfig): CompositeAnimation;
    export function spring(value: Value, config: AnimationConfig): CompositeAnimation;
    export function decay(value: Value, config: AnimationConfig): CompositeAnimation;
    export function sequence(animations: CompositeAnimation[]): CompositeAnimation;
    export function parallel(animations: CompositeAnimation[]): CompositeAnimation;
    export function loop(
      animation: CompositeAnimation,
      config?: { iterations?: number },
    ): CompositeAnimation;
  }

  // 平台相关类型
  export interface Platform {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    Version: number;
    select<T>(config: { [platform: string]: T }): T;
  }

  // 维度相关类型
  export interface Dimensions {
    get(dimension: 'window' | 'screen'): {
      width: number;
      height: number;
      scale: number;
      fontScale: number;
    };
  }

  // 键盘相关类型
  export interface Keyboard {
    addListener(
      eventName: string,
      callback: (event: KeyboardEvent) => void,
    ): { remove: () => void };
    removeListener(eventName: string, callback: Function): void;
    dismiss(): void;
  }
}
