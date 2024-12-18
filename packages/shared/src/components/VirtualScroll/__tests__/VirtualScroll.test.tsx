import React from 'react';

import { VirtualList } from '../VirtualList';
import { VirtualScroll } from '../index';
import { VirtualTable } from '../VirtualTable';
import { render, fireEvent, screen } from '@testing-library/react';

describe('VirtualScroll', () => {
  const mockItems = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

  const mockRenderItem = (item: any) => <div data-testid={`item-${item.id}`}>{item.name}</div>;

  it('应该正确渲染可见项', () => {
    const { container } = render(
      <VirtualScroll items={mockItems} itemHeight={50} height={200} renderItem={mockRenderItem} />,
    );

    // 检查容器高度
    expect(container.firstChild).toHaveStyle({ height: '200px' });

    // 检查内部容器总高度
    const innerContainer = container.querySelector('.virtual-scroll__inner');
    expect(innerContainer).toHaveStyle({ height: '50000px' }); // 1000 items * 50px

    // 检查可见项数量（200px / 50px = 4 items + overscan）
    const visibleItems = container.querySelectorAll('[data-testid^="item-"]');
    expect(visibleItems.length).toBeLessThanOrEqual(10);
  });

  it('应该响应滚动事件', () => {
    const onScroll = jest.fn();
    const onReachBottom = jest.fn();

    const { container } = render(
      <VirtualScroll
        items={mockItems}
        itemHeight={50}
        height={200}
        renderItem={mockRenderItem}
        onScroll={onScroll}
        onReachBottom={onReachBottom}
      />,
    );

    const scrollContainer = container.firstChild as HTMLElement;
    fireEvent.scroll(scrollContainer, { target: { scrollTop: 100 } });

    expect(onScroll).toHaveBeenCalledWith(100);
  });

  it('应该在滚动到底部时触发回调', () => {
    const onReachBottom = jest.fn();

    const { container } = render(
      <VirtualScroll
        items={mockItems}
        itemHeight={50}
        height={200}
        renderItem={mockRenderItem}
        onReachBottom={onReachBottom}
      />,
    );

    const scrollContainer = container.firstChild as HTMLElement;
    // 模拟滚动到底部
    fireEvent.scroll(scrollContainer, {
      target: {
        scrollTop: 49800, // (1000 items * 50px) - 200px
        scrollHeight: 50000,
        clientHeight: 200,
      },
    });

    expect(onReachBottom).toHaveBeenCalled();
  });
});

describe('VirtualTable', () => {
  const mockColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
  ];

  const mockDataSource = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Name ${i}`,
  }));

  it('应该正确渲染表格', () => {
    const { container } = render(
      <VirtualTable columns={mockColumns} dataSource={mockDataSource} height={400} />,
    );

    // 检查表头
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();

    // 检查表格内容
    expect(container.querySelector('.virtual-table__body')).toBeInTheDocument();
  });

  it('应该支持选择功能', () => {
    const onSelectChange = jest.fn();

    render(
      <VirtualTable
        columns={mockColumns}
        dataSource={mockDataSource}
        height={400}
        selectable
        selectedRowKeys={[]}
        onSelectChange={onSelectChange}
      />,
    );

    // 点击第一行的复选框
    const checkbox = screen.getAllByRole('checkbox')[1]; // 第一个是表头的复选框
    fireEvent.click(checkbox);

    expect(onSelectChange).toHaveBeenCalledWith([0]);
  });

  it('应该支持自定义渲染', () => {
    const columns = [
      ...mockColumns,
      {
        title: 'Action',
        dataIndex: 'action',
        render: (_: any, record: any) => <button data-testid={`btn-${record.id}`}>Click</button>,
      },
    ];

    render(<VirtualTable columns={columns} dataSource={mockDataSource} height={400} />);

    expect(screen.getByTestId('btn-0')).toBeInTheDocument();
  });
});

describe('VirtualList', () => {
  const mockItems = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

  const mockRenderItem = (item: any) => <div data-testid={`item-${item.id}`}>{item.name}</div>;

  it('应该正确渲染列表', () => {
    const { container } = render(
      <VirtualList items={mockItems} height={400} renderItem={mockRenderItem} />,
    );

    expect(container.querySelector('.virtual-list')).toBeInTheDocument();
  });

  it('应该支持选择功能', () => {
    const onSelectChange = jest.fn();

    render(
      <VirtualList
        items={mockItems}
        height={400}
        renderItem={mockRenderItem}
        selectable
        selectedKeys={[]}
        onSelectChange={onSelectChange}
      />,
    );

    // 点击第一个列表项
    const firstItem = screen.getByTestId('item-0').parentElement;
    fireEvent.click(firstItem!);

    expect(onSelectChange).toHaveBeenCalledWith([0]);
  });

  it('应该显示加载状态', () => {
    render(<VirtualList items={[]} height={400} renderItem={mockRenderItem} loading />);

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('应该显示空状态', () => {
    render(
      <VirtualList
        items={[]}
        height={400}
        renderItem={mockRenderItem}
        empty={<div>暂无数据</div>}
      />,
    );

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
});
