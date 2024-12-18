/**
 * @fileoverview TS 文件 react-native-animated.d.ts 的功能描述
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

    export interface CompositeAnimation {
      start: (callback?: (finished: boolean) => void) => void;
      stop: () => void;
    }

    export interface AnimationConfig {
      toValue: number | Animated.Value;
      duration?: number;
      easing?: (value: number) => number;
      delay?: number;
      useNativeDriver?: boolean;
    }

    export function timing(value: Animated.Value, config: AnimationConfig): CompositeAnimation;

    export function spring(value: Animated.Value, config: AnimationConfig): CompositeAnimation;

    export function decay(value: Animated.Value, config: AnimationConfig): CompositeAnimation;

    export function parallel(animations: CompositeAnimation[]): CompositeAnimation;

    export function sequence(animations: CompositeAnimation[]): CompositeAnimation;

    export function loop(
      animation: CompositeAnimation,
      config?: { iterations?: number },
    ): CompositeAnimation;
  }

  export const Easing: {
    linear: (t: number) => number;
    ease: (t: number) => number;
    quad: (t: number) => number;
    cubic: (t: number) => number;
    bezier: (x1: number, y1: number, x2: number, y2: number) => (t: number) => number;
    circle: (t: number) => number;
    sin: (t: number) => number;
    exp: (t: number) => number;
    elastic: (bounciness?: number) => (t: number) => number;
    back: (s?: number) => (t: number) => number;
    bounce: (t: number) => number;
    inOut: (easing: (t: number) => number) => (t: number) => number;
    out: (easing: (t: number) => number) => (t: number) => number;
    in: (easing: (t: number) => number) => (t: number) => number;
  };
}
