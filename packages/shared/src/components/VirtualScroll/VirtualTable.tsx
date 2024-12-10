import React from 'react';
import { VirtualScroll } from './index';

export interface VirtualTableColumn<T = any> {
  /** 列标题 */
  title: React.ReactNode;
  /** 列数据字段 */
  dataIndex: keyof T;
  /** 列宽度 */
  width?: number | string;
  /** 自定义渲染函数 */
  render?: (value: any, record: T, index: number) => React.ReactNode;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 是否固定列 */
  fixed?: 'left' | 'right';
  /** 排序函数 */
  sorter?: (a: T, b: T) => number;
}

export interface VirtualTableProps<T = any> {
  /** 数据源 */
  dataSource: T[];
  /** 列配置 */
  columns: VirtualTableColumn<T>[];
  /** 行高 */
  rowHeight?: number;
  /** 表格高度 */
  height?: number | string;
  /** 表头高度 */
  headerHeight?: number;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否显示斑马纹 */
  striped?: boolean;
  /** 是否可选择 */
  selectable?: boolean;
  /** 选中的行键值 */
  selectedRowKeys?: React.Key[];
  /** 选择改变回调 */
  onSelectChange?: (selectedRowKeys: React.Key[]) => void;
  /** 行键值字段 */
  rowKey?: string | ((record: T) => React.Key);
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
 * 虚拟滚动表格组件
 */
export function VirtualTable<T extends Record<string, any>>({
  dataSource,
  columns,
  rowHeight = 48,
  height = 400,
  headerHeight = 56,
  bordered = false,
  striped = true,
  selectable = false,
  selectedRowKeys = [],
  onSelectChange,
  rowKey = 'id',
  className,
  style,
  loading,
  empty,
  onScroll,
  onReachBottom
}: VirtualTableProps<T>) {
  // 获取行键值
  const getRowKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  // 渲染表头
  const renderHeader = () => (
    <div
      className="virtual-table__header"
      style={{ height: headerHeight }}
    >
      <div className="virtual-table__row">
        {selectable && (
          <div className="virtual-table__cell virtual-table__cell--checkbox">
            <input
              type="checkbox"
              checked={
                dataSource.length > 0 &&
                selectedRowKeys.length === dataSource.length
              }
              onChange={(e) => {
                if (onSelectChange) {
                  onSelectChange(
                    e.target.checked
                      ? dataSource.map((item, index) => getRowKey(item, index))
                      : []
                  );
                }
              }}
            />
          </div>
        )}
        {columns.map((column, index) => (
          <div
            key={index}
            className={`virtual-table__cell ${
              column.fixed ? `virtual-table__cell--${column.fixed}` : ''
            }`}
            style={{
              width: column.width,
              textAlign: column.align,
              flex: column.width ? undefined : 1
            }}
          >
            {column.title}
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染行
  const renderRow = (record: T, index: number) => (
    <div
      className={`virtual-table__row ${
        striped && index % 2 === 1 ? 'virtual-table__row--striped' : ''
      } ${
        selectedRowKeys.includes(getRowKey(record, index))
          ? 'virtual-table__row--selected'
          : ''
      }`}
    >
      {selectable && (
        <div className="virtual-table__cell virtual-table__cell--checkbox">
          <input
            type="checkbox"
            checked={selectedRowKeys.includes(getRowKey(record, index))}
            onChange={(e) => {
              if (onSelectChange) {
                const key = getRowKey(record, index);
                onSelectChange(
                  e.target.checked
                    ? [...selectedRowKeys, key]
                    : selectedRowKeys.filter((k) => k !== key)
                );
              }
            }}
          />
        </div>
      )}
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`virtual-table__cell ${
            column.fixed ? `virtual-table__cell--${column.fixed}` : ''
          }`}
          style={{
            width: column.width,
            textAlign: column.align,
            flex: column.width ? undefined : 1
          }}
        >
          {column.render
            ? column.render(record[column.dataIndex], record, index)
            : record[column.dataIndex]}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <div className="virtual-table__loading">加载中...</div>;
  }

  if (!dataSource.length && empty) {
    return <div className="virtual-table__empty">{empty}</div>;
  }

  return (
    <div
      className={`virtual-table ${bordered ? 'virtual-table--bordered' : ''} ${
        className || ''
      }`}
      style={style}
    >
      {renderHeader()}
      <div className="virtual-table__body" style={{ height }}>
        <VirtualScroll
          items={dataSource}
          itemHeight={rowHeight}
          height={typeof height === 'number' ? height : 400}
          renderItem={renderRow}
          onScroll={onScroll}
          onReachBottom={onReachBottom}
        />
      </div>
    </div>
  );
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .virtual-table {
    position: relative;
    background-color: var(--theme-background-color);
    border: 1px solid var(--theme-border-color);
    border-radius: 8px;
    overflow: hidden;
  }

  .virtual-table--bordered .virtual-table__cell {
    border-right: 1px solid var(--theme-border-color);
  }

  .virtual-table--bordered .virtual-table__cell:last-child {
    border-right: none;
  }

  .virtual-table__header {
    border-bottom: 1px solid var(--theme-border-color);
    background-color: var(--theme-background-color-light);
  }

  .virtual-table__body {
    overflow: auto;
  }

  .virtual-table__row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--theme-border-color);
  }

  .virtual-table__row:last-child {
    border-bottom: none;
  }

  .virtual-table__row--striped {
    background-color: var(--theme-background-color-light);
  }

  .virtual-table__row--selected {
    background-color: var(--theme-primary-color-10);
  }

  .virtual-table__cell {
    padding: 12px 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .virtual-table__cell--checkbox {
    width: 48px;
    flex: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .virtual-table__cell--left {
    text-align: left;
  }

  .virtual-table__cell--center {
    text-align: center;
  }

  .virtual-table__cell--right {
    text-align: right;
  }

  .virtual-table__loading,
  .virtual-table__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: var(--theme-text-color-secondary);
  }
`;
document.head.appendChild(style); 