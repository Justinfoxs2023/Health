import React from 'react';

import { VirtualScroll } from './index';

export interface IVirtualListProps<T = any> {
  /** 数据源 */
  items: T[];
  /** 行高 */
  itemHeight?: number;
  /** 列表高度 */
  height?: number | string;
  /** 渲染项的函数 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否可选择 */
  selectable?: boolean;
  /** 选中的项键值 */
  selectedKeys?: React.Key[];
  /** 选择改变回调 */
  onSelectChange?: (selectedKeys: React.Key[]) => void;
  /** 项键值字段 */
  itemKey?: string | ((item: T) => React.Key);
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 加载状态 */
  loading?: boolean;
  /** 空状态渲染 */
  empty?: React.ReactNode;
  /** 滚动事件回调 */
  onScroll?: (scrollTop: number) => void;
  /** 到达底部回调 */
  onReachBottom?: () => void;
}

/**
 * 虚拟滚动列表组件
 */
export function VirtualList<T extends Record<string, any>>({
  items,
  itemHeight = 48,
  height = 400,
  renderItem,
  bordered = false,
  selectable = false,
  selectedKeys = [],
  onSelectChange,
  itemKey = 'id',
  className,
  style,
  loading,
  empty,
  onScroll,
  onReachBottom,
}: IVirtualListProps<T>): import('D:/Health/node_modules/@types/react/jsx-runtime').JSX.Element {
  // 获取项键值
  const getItemKey = (item: T, index: number): React.Key => {
    if (typeof itemKey === 'function') {
      return itemKey(item);
    }
    return item[itemKey] ?? index;
  };

  // 渲染列表项
  const renderListItem = (item: T, index: number) => {
    const key = getItemKey(item, index);
    const isSelected = selectedKeys.includes(key);

    return (
      <div
        className={`virtual-list__item ${isSelected ? 'virtual-list__item--selected' : ''}`}
        onClick={() => {
          if (selectable && onSelectChange) {
            onSelectChange(
              isSelected ? selectedKeys.filter(k => k !== key) : [...selectedKeys, key],
            );
          }
        }}
      >
        {selectable && (
          <div className="virtual-list__checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={e => {
                if (onSelectChange) {
                  onSelectChange(
                    e.target.checked ? [...selectedKeys, key] : selectedKeys.filter(k => k !== key),
                  );
                }
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
        <div className="virtual-list__content">{renderItem(item, index)}</div>
      </div>
    );
  };

  if (loading) {
    return <div className="virtual-list__loading">加载中...</div>;
  }

  if (!items.length && empty) {
    return <div className="virtual-list__empty">{empty}</div>;
  }

  return (
    <div
      className={`virtual-list ${bordered ? 'virtual-list--bordered' : ''} ${className || ''}`}
      style={style}
    >
      <VirtualScroll
        items={items}
        itemHeight={itemHeight}
        height={typeof height === 'number' ? height : 400}
        renderItem={renderListItem}
        onScroll={onScroll}
        onReachBottom={onReachBottom}
      />
    </div>
  );
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .virtual-list {
    position: relative;
    background-color: var(--theme-background-color);
    border-radius: 8px;
    overflow: hidden;
  }

  .virtual-list--bordered {
    border: 1px solid var(--theme-border-color);
  }

  .virtual-list__item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--theme-border-color);
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .virtual-list__item:last-child {
    border-bottom: none;
  }

  .virtual-list__item:hover {
    background-color: var(--theme-hover-color);
  }

  .virtual-list__item--selected {
    background-color: var(--theme-primary-color-10);
  }

  .virtual-list__checkbox {
    flex: none;
    margin-right: 16px;
  }

  .virtual-list__content {
    flex: 1;
    min-width: 0;
  }

  .virtual-list__loading,
  .virtual-list__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: var(--theme-text-color-secondary);
  }
`;
document.head.appendChild(style);
