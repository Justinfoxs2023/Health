import { Animated } from 'react-native';

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
  useNativeDriver?: boolean;
}

export interface AnimationSystem {
  timing: AnimationTiming;
  spring: AnimationSpring;
  decay: AnimationDecay;
  parallel: AnimationGroup;
  sequence: AnimationGroup;
  loop: AnimationLoop;
}

// 拆分动画类型定义
interface AnimationTiming {
  (value: Animated.Value, config: AnimationConfig): Animated.CompositeAnimation;
}

// ... 其他动画类型定义

export interface AnimatedValue extends Animated.Value {
  interpolate(config: {
    inputRange: number[];
    outputRange: number[] | string[];
    easing?: (input: number) => number;
    extrapolate?: 'extend' | 'clamp' | 'identity';
    extrapolateLeft?: 'extend' | 'clamp' | 'identity';
    extrapolateRight?: 'extend' | 'clamp' | 'identity';
  }): AnimatedValue;
} 