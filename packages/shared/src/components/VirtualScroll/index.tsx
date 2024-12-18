import React, { useEffect, useRef, useState, useMemo } from 'react';

import { debounce } from '../../utils';

export interface IVirtualScrollProps<T = any> {
  /** 数据源 */
  items: T[];
  /** 行高 */
  itemHeight: number;
  /** 可视区域高度 */
  height: number;
  /** 渲染行的函数 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 缓冲区行数 */
  overscan?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 滚动事件回调 */
  onScroll?: (scrollTop: number) => void;
  /** 到达底部回调 */
  onReachBottom?: () => void;
  /** 到达底部的阈值 */
  bottomThreshold?: number;
}

/**
 * 虚拟滚动组件
 */
export function VirtualScroll<T>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 3,
  className,
  style,
  onScroll,
  onReachBottom,
  bottomThreshold = 100,
}: IVirtualScrollProps<T>): import('D:/Health/node_modules/@types/react/jsx-runtime').JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // 计算可视区域的起始和结束索引
  const { visibleStartIndex, visibleEndIndex } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(height / itemHeight);
    const startIndex = Math.max(0, start - overscan);
    const endIndex = Math.min(items.length, start + visibleCount + overscan);
    return {
      visibleStartIndex: startIndex,
      visibleEndIndex: endIndex,
    };
  }, [scrollTop, height, itemHeight, items.length, overscan]);

  // 计算总高度和可见项的偏移量
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStartIndex * itemHeight;

  // 处理滚动事件
  const handleScroll = useMemo(
    () =>
      debounce((e: React.UIEvent<HTMLDivElement>) => {
        const newScrollTop = e.currentTarget.scrollTop;
        setScrollTop(newScrollTop);
        onScroll?.(newScrollTop);

        // 检查是否到达底部
        const { scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - (newScrollTop + clientHeight) <= bottomThreshold && onReachBottom) {
          onReachBottom();
        }
      }, 16),
    [onScroll, onReachBottom, bottomThreshold],
  );

  // 监听容器大小变化
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { height } = entries[0].contentRect;
      const visibleCount = Math.ceil(height / itemHeight);
      const endIndex = Math.min(items.length, visibleStartIndex + visibleCount + overscan);
      if (endIndex !== visibleEndIndex) {
        setScrollTop(containerRef.current?.scrollTop || 0);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [itemHeight, items.length, overscan, visibleStartIndex, visibleEndIndex]);

  return (
    <div
      ref={containerRef}
      className={`virtual-scroll ${className || ''}`}
      style={{
        height,
        overflow: 'auto',
        position: 'relative',
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div
        className="virtual-scroll__inner"
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        <div
          className="virtual-scroll__items"
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
          }}
        >
          {items.slice(visibleStartIndex, visibleEndIndex).map((item, index) => (
            <div
              key={visibleStartIndex + index}
              className="virtual-scroll__item"
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleStartIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .virtual-scroll {
    -webkit-overflow-scrolling: touch;
  }

  .virtual-scroll__inner {
    will-change: transform;
  }

  .virtual-scroll__items {
    will-change: transform;
  }

  .virtual-scroll__item {
    will-change: transform;
  }
`;
document.head.appendChild(style);
