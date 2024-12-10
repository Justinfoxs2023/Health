import { useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { usePinchZoom } from '@/hooks/usePinchZoom';

interface GestureConfig {
  enableSwipe?: boolean;
  enablePinch?: boolean;
  enablePull?: boolean;
  onSwipe?: (direction: string) => void;
  onPinch?: (scale: number) => void;
  onPull?: () => void;
}

export const useGestureInteractions = (config: GestureConfig) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pullStartY = useRef(0);

  // 滑动手势配置
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => config.onSwipe?.('left'),
    onSwipedRight: () => config.onSwipe?.('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // 缩放手势配置
  const { scale, handlePinchStart, handlePinchMove, handlePinchEnd } = usePinchZoom({
    onPinch: config.onPinch
  });

  // 下拉刷新配置
  useEffect(() => {
    const element = containerRef.current;
    if (!element || !config.enablePull) return;

    const handleTouchStart = (e: TouchEvent) => {
      pullStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const pullDistance = e.touches[0].clientY - pullStartY.current;
      if (pullDistance > 60 && element.scrollTop === 0) {
        config.onPull?.();
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [config.enablePull, config.onPull]);

  return {
    ref: containerRef,
    ...swipeHandlers,
    scale,
    handlePinchStart,
    handlePinchMove,
    handlePinchEnd
  };
}; 