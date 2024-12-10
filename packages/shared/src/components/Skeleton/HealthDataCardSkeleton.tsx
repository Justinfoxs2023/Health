import React from 'react';
import { Skeleton } from './index';

export interface HealthDataCardSkeletonProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 健康数据卡片骨架屏组件
 */
export const HealthDataCardSkeleton: React.FC<HealthDataCardSkeletonProps> = ({
  className,
  style
}) => {
  return (
    <div
      className={`health-data-card-skeleton ${className || ''}`}
      style={style}
    >
      {/* 标题区域 */}
      <div className="health-data-card-skeleton__header">
        <Skeleton
          variant="text"
          width={120}
          height={24}
          className="health-data-card-skeleton__title"
        />
        <Skeleton
          variant="circular"
          width={32}
          className="health-data-card-skeleton__icon"
        />
      </div>

      {/* 数据区域 */}
      <div className="health-data-card-skeleton__content">
        <div className="health-data-card-skeleton__value">
          <Skeleton
            variant="text"
            width={80}
            height={40}
            className="health-data-card-skeleton__number"
          />
          <Skeleton
            variant="text"
            width={40}
            height={20}
            className="health-data-card-skeleton__unit"
          />
        </div>
        <Skeleton
          variant="text"
          width={60}
          height={24}
          className="health-data-card-skeleton__status"
        />
      </div>

      {/* 图表区域 */}
      <div className="health-data-card-skeleton__chart">
        <Skeleton
          variant="rectangular"
          height={120}
          className="health-data-card-skeleton__graph"
        />
      </div>

      {/* 底部区域 */}
      <div className="health-data-card-skeleton__footer">
        <Skeleton
          variant="text"
          width={100}
          height={20}
          className="health-data-card-skeleton__time"
        />
        <Skeleton
          variant="text"
          width={80}
          height={20}
          className="health-data-card-skeleton__action"
        />
      </div>
    </div>
  );
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .health-data-card-skeleton {
    display: flex;
    flex-direction: column;
    padding: 16px;
    background-color: var(--theme-background-color);
    border: 1px solid var(--theme-border-color);
    border-radius: 8px;
    box-shadow: var(--theme-shadow);
  }

  .health-data-card-skeleton__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .health-data-card-skeleton__content {
    margin-bottom: 16px;
  }

  .health-data-card-skeleton__value {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 8px;
  }

  .health-data-card-skeleton__chart {
    margin-bottom: 16px;
  }

  .health-data-card-skeleton__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
document.head.appendChild(style); 