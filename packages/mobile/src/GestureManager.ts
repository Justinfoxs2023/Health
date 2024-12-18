import { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

interface IGestureConfig {
  /** enableSwipe 的描述 */
  enableSwipe?: boolean;
  /** enablePinch 的描述 */
  enablePinch?: boolean;
  /** enablePull 的描述 */
  enablePull?: boolean;
  /** onSwipe 的描述 */
  onSwipe?: (direction: string) => void;
  /** onPinch 的描述 */
  onPinch?: (scale: number) => void;
  /** onPull 的描述 */
  onPull?: () => void;
}

export class GestureManager {
  private static instance: GestureManager;
  private gestureConfig: IGestureConfig = {
    enableSwipe: true,
    enablePinch: true,
    enablePull: true,
  };

  // 手势配置
  static configure(config: Partial<IGestureConfig>) {
    if (!this.instance) {
      this.instance = new GestureManager();
    }
    Object.assign(this.instance.gestureConfig, config);
  }

  // 滑动导航Hook
  static useSwipeNavigation() {
    const navigate = useNavigate();
    const touchStartX = useRef(0);

    const handlers = useSwipeable({
      onSwipedLeft: () => {
        if (this.instance.gestureConfig.enableSwipe) {
          navigate(1);
        }
      },
      onSwipedRight: () => {
        if (this.instance.gestureConfig.enableSwipe) {
          navigate(-1);
        }
      },
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    });

    return handlers;
  }

  // 缩放图表Hook
  static usePinchZoom(elementRef: React.RefObject<HTMLElement>) {
    useEffect(() => {
      if (!this.instance.gestureConfig.enablePinch) return;

      let initialDistance = 0;
      let currentScale = 1;

      const element = elementRef.current;
      if (!element) return;

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          initialDistance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY,
          );
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          const distance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY,
          );

          currentScale = Math.min(Math.max(distance / initialDistance, 0.5), 3);
          element.style.transform = `scale(${currentScale})`;
        }
      };

      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchmove', handleTouchMove);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
      };
    }, [elementRef]);
  }

  // 下拉刷新Hook
  static usePullToRefresh(onRefresh: () => Promise<void>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const pulling = useRef(false);
    const startY = useRef(0);

    useEffect(() => {
      if (!this.instance.gestureConfig.enablePull) return;

      const element = containerRef.current;
      if (!element) return;

      const handleTouchStart = (e: TouchEvent) => {
        if (element.scrollTop === 0) {
          pulling.current = true;
          startY.current = e.touches[0].clientY;
        }
      };

      const handleTouchMove = async (e: TouchEvent) => {
        if (!pulling.current) return;

        const deltaY = e.touches[0].clientY - startY.current;
        if (deltaY > 60) {
          pulling.current = false;
          await onRefresh();
        }
      };

      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchmove', handleTouchMove);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
      };
    }, [onRefresh]);

    return containerRef;
  }
}
