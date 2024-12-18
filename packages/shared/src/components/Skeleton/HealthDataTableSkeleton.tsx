import React from 'react';

import { Skeleton } from './index';

export interface IHealthDataTableSkeletonProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 行数 */
  rows?: number;
  /** 列数 */
  columns?: number;
}

/**
 * 健康数据表格骨架屏组件
 */
export const HealthDataTableSkeleton: React.FC<IHealthDataTableSkeletonProps> = ({
  className,
  style,
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className={`health-data-table-skeleton ${className || ''}`} style={style}>
      {/* 表头 */}
      <div className="health-data-table-skeleton__header">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            variant="text"
            width={100}
            height={24}
            className="health-data-table-skeleton__header-cell"
          />
        ))}
      </div>

      {/* 表格内容 */}
      <div className="health-data-table-skeleton__body">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="health-data-table-skeleton__row">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                variant="text"
                width={colIndex === columns - 1 ? 60 : 100}
                height={20}
                className="health-data-table-skeleton__cell"
              />
            ))}
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className="health-data-table-skeleton__footer">
        <div className="health-data-table-skeleton__pagination">
          <Skeleton
            variant="rectangular"
            width={32}
            height={32}
            borderRadius={4}
            className="health-data-table-skeleton__page-button"
          />
          <Skeleton
            variant="rectangular"
            width={32}
            height={32}
            borderRadius={4}
            className="health-data-table-skeleton__page-button"
          />
          <Skeleton
            variant="text"
            width={100}
            height={32}
            className="health-data-table-skeleton__page-info"
          />
          <Skeleton
            variant="rectangular"
            width={32}
            height={32}
            borderRadius={4}
            className="health-data-table-skeleton__page-button"
          />
          <Skeleton
            variant="rectangular"
            width={32}
            height={32}
            borderRadius={4}
            className="health-data-table-skeleton__page-button"
          />
        </div>
      </div>
    </div>
  );
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .health-data-table-skeleton {
    display: flex;
    flex-direction: column;
    background-color: var(--theme-background-color);
    border: 1px solid var(--theme-border-color);
    border-radius: 8px;
    overflow: hidden;
  }

  .health-data-table-skeleton__header {
    display: grid;
    grid-template-columns: repeat(var(--columns, 4), 1fr);
    gap: 16px;
    padding: 16px;
    background-color: var(--theme-background-color-light);
    border-bottom: 1px solid var(--theme-border-color);
  }

  .health-data-table-skeleton__body {
    padding: 16px;
  }

  .health-data-table-skeleton__row {
    display: grid;
    grid-template-columns: repeat(var(--columns, 4), 1fr);
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid var(--theme-border-color);
  }

  .health-data-table-skeleton__row:last-child {
    border-bottom: none;
  }

  .health-data-table-skeleton__footer {
    padding: 16px;
    border-top: 1px solid var(--theme-border-color);
  }

  .health-data-table-skeleton__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .health-data-table-skeleton__page-info {
    margin: 0 16px;
  }
`;
document.head.appendChild(style);
