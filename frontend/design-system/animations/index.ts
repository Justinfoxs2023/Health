import { Animated, Easing } from 'react-native';

export const animations = {
  // 淡入淡出
  fade: {
    in: (value: Animated.Value) => {
      return Animated.timing(value, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      });
    },
    out: (value: Animated.Value) => {
      return Animated.timing(value, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      });
    },
  },

  // 滑动
  slide: {
    in: (value: Animated.Value, direction: 'left' | 'right' | 'up' | 'down') => {
      const initialValue = {
        left: 100,
        right: -100,
        up: 100,
        down: -100,
      }[direction];

      value.setValue(initialValue);
      return Animated.spring(value, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 8,
      });
    },
  },

  // 缩放
  scale: {
    in: (value: Animated.Value) => {
      value.setValue(0.3);
      return Animated.spring(value, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      });
    },
  },

  // 加载动画
  loading: {
    rotate: (value: Animated.Value) => {
      value.setValue(0);
      return Animated.loop(
        Animated.timing(value, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
    },
  },
};
