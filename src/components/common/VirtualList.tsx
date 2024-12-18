import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

interface IVirtualListProps<T> {
  /** items 的描述 */
    items: T[];
  /** itemHeight 的描述 */
    itemHeight: number;
  /** windowHeight 的描述 */
    windowHeight: number;
  /** renderItem 的描述 */
    renderItem: (item: T, index: number) => React.ReactNode;
  /** onEndReached 的描述 */
    onEndReached?: undefined | () => void;
}

const ListContainer = styled.div`
  overflow-y: auto;
  position: relative;
`;

const ListContent = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  position: relative;
`;

export function VirtualList<T>({
  items,
  itemHeight,
  windowHeight,
  renderItem,
  onEndReached,
}: IVirtualListProps<T>): import("D:/Health/node_modules/@types/react/jsx-runtime").JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(windowHeight / itemHeight);
  const bufferCount = Math.floor(visibleCount / 2);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const newScrollTop = containerRef.current.scrollTop;
      setScrollTop(newScrollTop);

      // 检查是否到达底部
      if (containerRef.current.scrollHeight - newScrollTop <= windowHeight + 100) {
        onEndReached?.();
      }
    };

    containerRef.current?.addEventListener('scroll', handleScroll);
    return () => containerRef.current?.removeEventListener('scroll', handleScroll);
  }, [windowHeight, onEndReached]);

  useEffect(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferCount);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + windowHeight) / itemHeight) + bufferCount,
    );

    setVisibleItems(items.slice(startIndex, endIndex));
  }, [scrollTop, items, itemHeight, windowHeight, bufferCount]);

  return (
    <ListContainer ref={containerRef} style={{ height: windowHeight }}>
      <ListContent height={totalHeight}>
        {visibleItems.map((item, index) => (
          <div
            key={index}
            style={{
              position absolute
              top {index  itemHeight}px
              height itemHeight
            }}
          >
            {renderItemitem index}
          </div>
        ))}
      </ListContent>
    </ListContainer>
  );
}
