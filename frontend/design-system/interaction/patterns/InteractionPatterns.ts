import { AnimationSystem } from '../animations/AnimationSystem';
import { FeedbackSystem } from '../feedback/FeedbackSystem';
import { GestureSystem } from '../gestures/GestureSystem';

export class InteractionPatterns {
  // 按钮交互模式
  static buttonPress = {
    animation: (scale: Animated.Value) => {
      return AnimationSystem.sequence([
        AnimationSystem.scale(scale, 0.95),
        AnimationSystem.scale(scale, 1),
      ]);
    },
    feedback: () => {
      FeedbackSystem.feedback({
        haptic: 'light',
        sound: 'tap',
      });
    },
  };

  // 列表项滑动模式
  static listItemSwipe = {
    gesture: (onSwipe: (direction: 'left' | 'right') => void) => {
      return GestureSystem.createPanResponder({
        onSwipe: direction => {
          if (direction === 'left' || direction === 'right') {
            onSwipe(direction);
          }
        },
        threshold: {
          swipe: 80,
        },
      });
    },
    animation: (translateX: Animated.Value, direction: 'left' | 'right') => {
      const toValue = direction === 'left' ? -80 : 80;
      return AnimationSystem.translate(translateX, toValue, {
        direction: 'x',
      });
    },
  };

  // 下拉刷新模式
  static pullToRefresh = {
    gesture: (onRefresh: () => void) => {
      return GestureSystem.createPanResponder({
        onSwipe: direction => {
          if (direction === 'down') {
            onRefresh();
          }
        },
        threshold: {
          swipe: 100,
        },
      });
    },
    feedback: () => {
      FeedbackSystem.feedback({
        haptic: 'medium',
      });
    },
  };

  // 长按操作模式
  static longPress = {
    gesture: (onLongPress: () => void) => {
      return GestureSystem.createPanResponder({
        onLongPress,
        threshold: {
          longPress: 500,
        },
      });
    },
    feedback: () => {
      FeedbackSystem.feedback({
        haptic: 'heavy',
        sound: 'notification',
      });
    },
  };
}
