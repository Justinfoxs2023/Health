import { Animated } from 'react-native';

export interface IAnimationConfig {
  /** duration 的描述 */
  duration?: number;
  /** delay 的描述 */
  delay?: number;
  /** easing 的描述 */
  easing?: (value: number) => number;
  /** useNativeDriver 的描述 */
  useNativeDriver?: boolean;
}

export interface IAnimationSystem {
  /** timing 的描述 */
  timing: IAnimationTiming;
  /** spring 的描述 */
  spring: AnimationSpring;
  /** decay 的描述 */
  decay: AnimationDecay;
  /** parallel 的描述 */
  parallel: AnimationGroup;
  /** sequence 的描述 */
  sequence: AnimationGroup;
  /** loop 的描述 */
  loop: AnimationLoop;
}

// 拆分动画类型定义
interface IAnimationTiming {
  (value: Animated.Value, config: IAnimationConfig): Animated.CompositeAnimation;
}

// ... 其他动画类型定义

export interface IAnimatedValue extends Animated.Value {
  interpolate(config: {
    inputRange: number[];
    outputRange: number[] | string[];
    easing?: (input: number) => number;
    extrapolate?: 'extend' | 'clamp' | 'identity';
    extrapolateLeft?: 'extend' | 'clamp' | 'identity';
    extrapolateRight?: 'extend' | 'clamp' | 'identity';
  }): IAnimatedValue;
}
