import { PlatformAdapter } from '../platform/PlatformAdapter';
import { GestureSystem } from './gestures/GestureSystem';
import { FeedbackSystem } from './feedback/FeedbackSystem';

export class InteractionAdapter {
  // 平台特定的交互配置
  static readonly config = {
    touch: {
      minTargetSize: PlatformAdapter.selectByDevice({
        mobile: 44,
        tablet: 40,
        desktop: 32,
        default: 44
      }),
      feedbackDelay: PlatformAdapter.select({
        ios: 50,
        android: 30,
        default: 0
      })
    },
    animation: {
      duration: PlatformAdapter.select({
        ios: 300,
        android: 250,
        default: 200
      }),
      timing: PlatformAdapter.select({
        ios: 'ease-out',
        android: 'ease-in-out',
        default: 'linear'
      })
    }
  };

  // 创建平台特定的手势处理器
  static createGestureHandler(config: {
    onTap?: () => void;
    onLongPress?: () => void;
    onSwipe?: (direction: string) => void;
  }) {
    if (PlatformAdapter.isMobile) {
      return GestureSystem.createPanResponder({
        onSwipe: config.onSwipe,
        onLongPress: config.onLongPress,
        threshold: {
          longPress: this.config.touch.feedbackDelay
        }
      });
    } else {
      // 桌面端事件处理
      return {
        onClick: config.onTap,
        onContextMenu: config.onLongPress,
        onMouseDown: () => {
          FeedbackSystem.feedback({
            haptic: 'light'
          });
        }
      };
    }
  }

  // 创建平台特定的滚动处理器
  static createScrollHandler(config: {
    onScroll?: (event: any) => void;
    onEndReached?: () => void;
    onRefresh?: () => void;
  }) {
    return PlatformAdapter.select({
      ios: {
        onScroll: config.onScroll,
        onEndReached: config.onEndReached,
        refreshControl: config.onRefresh
      },
      android: {
        onScroll: config.onScroll,
        onEndReached: config.onEndReached,
        onRefresh: config.onRefresh
      },
      web: {
        onScroll: (event: any) => {
          const { scrollHeight, scrollTop, clientHeight } = event.target;
          if (scrollHeight - scrollTop === clientHeight) {
            config.onEndReached?.();
          }
          config.onScroll?.(event);
        }
      },
      default: {}
    });
  }
} 