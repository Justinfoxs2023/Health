import React from 'react';

import { HealthDataCard } from '../index';
import { HealthDataType } from '../../../types';
import { render } from '@testing-library/react';

describe('HealthDataCard 组件', () => {
  const mockData = {
    id: '1',
    userId: 'user1',
    type: HealthDataType.BLOOD_PRESSURE,
    value: 120,
    unit: 'mmHg',
    timestamp: new Date('2024-01-01T12:00:00'),
    note: '测试数据',
  };

  it('应该渲染基础卡片', () => {
    const { container } = render(<HealthDataCard data={mockData} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染不同类型的健康数据', () => {
    const types = Object.values(HealthDataType);
    types.forEach(type => {
      const data = {
        ...mockData,
        type,
        value: type === HealthDataType.BLOOD_PRESSURE ? 120 : 80,
      };
      const { container } = render(<HealthDataCard data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('应该渲染不同状态的数值', () => {
    const values = [50, 80, 120];
    values.forEach(value => {
      const data = { ...mockData, value };
      const { container } = render(<HealthDataCard data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('应该渲染带备注的卡片', () => {
    const data = {
      ...mockData,
      note: '这是一条很长的备注信息，需要进行截断处理',
    };
    const { container } = render(<HealthDataCard data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染不带备注的卡片', () => {
    const data = { ...mockData, note: undefined };
    const { container } = render(<HealthDataCard data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该支持自定义类名', () => {
    const { container } = render(<HealthDataCard data={mockData} className="custom-card" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染不同时间格式', () => {
    const timestamps = [new Date('2024-01-01T12:00:00'), new Date('2024-01-01'), new Date()];
    timestamps.forEach(timestamp => {
      const data = { ...mockData, timestamp };
      const { container } = render(<HealthDataCard data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
