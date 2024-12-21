import { Animated, Easing } from 'react-native';

export class AnimationSystem {
  // 基础动画配置
  static readonly config = {
    duration: {
      quick: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      standard: Easing.bezier(0.4, 0, 0.2, 1),
      accelerate: Easing.bezier(0.4, 0, 1, 1),
      decelerate: Easing.bezier(0, 0, 0.2, 1),
    },
  };

  // 淡入淡出动画
  static fade(value: Animated.Value, toValue: number) {
    return Animated.timing(value, {
      toValue,
      duration: this.config.duration.normal,
      easing: this.config.easing.standard,
      useNativeDriver: true,
    });
  }

  // 缩放动画
  static scale(value: Animated.Value, toValue: number) {
    return Animated.spring(value, {
      toValue,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    });
  }

  // 位移动画
  static translate(
    value: Animated.Value,
    toValue: number,
    options?: {
      direction?: 'x' | 'y';
      duration?: number;
    },
  ) {
    return Animated.timing(value, {
      toValue,
      duration: options?.duration || this.config.duration.normal,
      easing: this.config.easing.standard,
      useNativeDriver: true,
    });
  }

  // 组合动画
  static combine(animations: Animated.CompositeAnimation[]) {
    return Animated.parallel(animations);
  }

  // 序列动画
  static sequence(animations: Animated.CompositeAnimation[]) {
    return Animated.sequence(animations);
  }
}
