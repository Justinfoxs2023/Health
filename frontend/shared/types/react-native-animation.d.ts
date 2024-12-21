/**
 * @fileoverview TS 文件 react-native-animation.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'react-native' {
  export namespace Animated {
    export class Value {
      constructor(value: number);
      setValue(value: number): void;
      setOffset(offset: number): void;
      flattenOffset(): void;
      addListener(callback: (state: { value: number }) => void): string;
      removeListener(id: string): void;
      removeAllListeners(): void;
      stopAnimation(callback?: (value: number) => void): void;
      interpolate(config: InterpolationConfigType): Animated.Value;
    }

    export interface InterpolationConfigType {
      inputRange: number[];
      outputRange: number[] | string[];
      easing?: (input: number) => number;
      extrapolate?: 'extend' | 'clamp' | 'identity';
      extrapolateLeft?: 'extend' | 'clamp' | 'identity';
      extrapolateRight?: 'extend' | 'clamp' | 'identity';
    }

    export interface AnimationConfig {
      toValue: number | Animated.Value;
      duration?: number;
      easing?: (value: number) => number;
      delay?: number;
      useNativeDriver?: boolean;
    }

    export interface CompositeAnimation {
      start: (callback?: (finished: boolean) => void) => void;
      stop: () => void;
    }

    export function timing(value: Animated.Value, config: AnimationConfig): CompositeAnimation;

    export function spring(value: Animated.Value, config: AnimationConfig): CompositeAnimation;

    export function parallel(animations: CompositeAnimation[]): CompositeAnimation;

    export function sequence(animations: CompositeAnimation[]): CompositeAnimation;

    export function loop(
      animation: CompositeAnimation,
      config?: { iterations?: number },
    ): CompositeAnimation;

    export const View: React.ComponentType<ViewProps>;
    export const Text: React.ComponentType<TextProps>;
    export const Image: React.ComponentType<ImageProps>;
    export const ScrollView: React.ComponentType<ScrollViewProps>;
  }
}
