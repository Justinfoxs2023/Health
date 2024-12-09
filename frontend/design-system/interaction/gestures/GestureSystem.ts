import { PanResponder, PanResponderGestureState } from 'react-native';

export interface GestureConfig {
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onPinch?: (scale: number) => void;
  onRotate?: (rotation: number) => void;
  onLongPress?: () => void;
  threshold?: {
    swipe?: number;
    pinch?: number;
    rotate?: number;
    longPress?: number;
  };
}

export class GestureSystem {
  private static readonly DEFAULT_THRESHOLD = {
    swipe: 50,
    pinch: 0.2,
    rotate: 20,
    longPress: 500
  };

  static createPanResponder(config: GestureConfig) {
    const threshold = { ...this.DEFAULT_THRESHOLD, ...config.threshold };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // 手势开始
      },

      onPanResponderMove: (_, gestureState) => {
        this.handleSwipe(gestureState, config, threshold);
      },

      onPanResponderRelease: () => {
        // 手势结束
      }
    });
  }

  private static handleSwipe(
    gestureState: PanResponderGestureState,
    config: GestureConfig,
    threshold: Required<GestureConfig['threshold']>
  ) {
    const { dx, dy } = gestureState;

    if (Math.abs(dx) > threshold.swipe) {
      config.onSwipe?.(dx > 0 ? 'right' : 'left');
    } else if (Math.abs(dy) > threshold.swipe) {
      config.onSwipe?.(dy > 0 ? 'down' : 'up');
    }
  }

  static isValidSwipe(velocity: number, distance: number, threshold: number): boolean {
    return Math.abs(velocity) > 0.3 && Math.abs(distance) > threshold;
  }
} 