import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../index';
import { HealthDataCardSkeleton } from '../HealthDataCardSkeleton';
import { HealthDataTableSkeleton } from '../HealthDataTableSkeleton';

describe('Skeleton', () => {
  it('应该正确渲染基础骨架屏', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('skeleton--wave');
  });

  it('应该支持不同的变体', () => {
    const { container: text } = render(<Skeleton variant="text" />);
    expect(text.firstChild).toHaveStyle({ height: '1em' });

    const { container: circular } = render(<Skeleton variant="circular" />);
    expect(circular.firstChild).toHaveStyle({ borderRadius: '50%' });

    const { container: rectangular } = render(<Skeleton variant="rectangular" />);
    expect(rectangular.firstChild).toHaveStyle({ height: '100px' });
  });

  it('应该支持自定义尺寸', () => {
    const { container } = render(
      <Skeleton width={200} height={100} borderRadius={8} />
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '100px',
      borderRadius: '8px'
    });
  });

  it('应该支持不同的动画效果', () => {
    const { container: wave } = render(<Skeleton effect="wave" />);
    expect(wave.firstChild).toHaveClass('skeleton--wave');

    const { container: pulse } = render(<Skeleton effect="pulse" />);
    expect(pulse.firstChild).toHaveClass('skeleton--pulse');

    const { container: noAnimation } = render(<Skeleton animation={false} />);
    expect(noAnimation.firstChild).not.toHaveClass('skeleton--wave');
    expect(noAnimation.firstChild).not.toHaveClass('skeleton--pulse');
  });

  it('应该支持自定义颜色', () => {
    const { container } = render(
      <Skeleton backgroundColor="#f0f0f0" animationColor="#e0e0e0" />
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({
      backgroundColor: '#f0f0f0',
      '--skeleton-animation-color': '#e0e0e0'
    });
  });
});

describe('HealthDataCardSkeleton', () => {
  it('应该正确渲染健康数据卡片骨架屏', () => {
    const { container } = render(<HealthDataCardSkeleton />);
    expect(container.querySelector('.health-data-card-skeleton')).toBeInTheDocument();
    expect(container.querySelector('.health-data-card-skeleton__header')).toBeInTheDocument();
    expect(container.querySelector('.health-data-card-skeleton__content')).toBeInTheDocument();
    expect(container.querySelector('.health-data-card-skeleton__chart')).toBeInTheDocument();
    expect(container.querySelector('.health-data-card-skeleton__footer')).toBeInTheDocument();
  });

  it('应该支持自定义类名和样式', () => {
    const { container } = render(
      <HealthDataCardSkeleton
        className="custom-class"
        style={{ margin: '20px' }}
      />
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('custom-class');
    expect(skeleton).toHaveStyle({ margin: '20px' });
  });
});

describe('HealthDataTableSkeleton', () => {
  it('应该正确渲染健康数据表格骨架屏', () => {
    const { container } = render(<HealthDataTableSkeleton />);
    expect(container.querySelector('.health-data-table-skeleton')).toBeInTheDocument();
    expect(container.querySelector('.health-data-table-skeleton__header')).toBeInTheDocument();
    expect(container.querySelector('.health-data-table-skeleton__body')).toBeInTheDocument();
    expect(container.querySelector('.health-data-table-skeleton__footer')).toBeInTheDocument();
  });

  it('应该支持自定义行数和列数', () => {
    const { container } = render(<HealthDataTableSkeleton rows={3} columns={3} />);
    const rows = container.querySelectorAll('.health-data-table-skeleton__row');
    const headerCells = container.querySelectorAll('.health-data-table-skeleton__header-cell');
    expect(rows).toHaveLength(3);
    expect(headerCells).toHaveLength(3);
  });

  it('应该支持自定义类名和样式', () => {
    const { container } = render(
      <HealthDataTableSkeleton
        className="custom-class"
        style={{ margin: '20px' }}
      />
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('custom-class');
    expect(skeleton).toHaveStyle({ margin: '20px' });
  });
}); 