import React from 'react';
import { render, screen } from '@testing-library/react';
import { HealthAnalysis } from '../index';
import { IHealthData, HealthDataType } from '../../../types';
import { analysisService } from '../../../services/analysis';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// Mock Chart component
jest.mock('../../Chart', () => ({
  Chart: () => <div data-testid="chart">Chart</div>
}));

describe('HealthAnalysis', () => {
  // 测试数据
  const mockData: IHealthData[] = [
    {
      id: '1',
      type: HealthDataType.BLOOD_PRESSURE,
      value: 120,
      timestamp: new Date('2023-01-01'),
      userId: 'user1'
    },
    {
      id: '2',
      type: HealthDataType.BLOOD_PRESSURE,
      value: 140,
      timestamp: new Date('2023-01-02'),
      userId: 'user1'
    },
    {
      id: '3',
      type: HealthDataType.BLOOD_PRESSURE,
      value: 160,
      timestamp: new Date('2023-01-03'),
      userId: 'user1'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染空数据状态', () => {
    render(<HealthAnalysis data={[]} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.getByText('请先添加健康数据')).toBeInTheDocument();
  });

  it('应该正确渲染统计指标', () => {
    render(<HealthAnalysis data={mockData} />);

    // 检查标题
    expect(screen.getByText('健康指标统计')).toBeInTheDocument();

    // 检查统计值
    expect(screen.getByText('120')).toBeInTheDocument(); // 最小值
    expect(screen.getByText('160')).toBeInTheDocument(); // 最大值
    expect(screen.getByText('140.0')).toBeInTheDocument(); // 平均值
    expect(screen.getByText('140')).toBeInTheDocument(); // 中位数
  });

  it('应该正确渲染趋势分析', () => {
    render(<HealthAnalysis data={mockData} />);

    // 检查标题
    expect(screen.getByText('趋势分析')).toBeInTheDocument();

    // 检查图表
    expect(screen.getByTestId('chart')).toBeInTheDocument();

    // 检查趋势信息
    expect(screen.getByText('趋势类型：')).toBeInTheDocument();
    expect(screen.getByText('上升')).toBeInTheDocument();
    expect(screen.getByText('变化率：')).toBeInTheDocument();
  });

  it('应该正确渲染健康评估', () => {
    render(<HealthAnalysis data={mockData} />);

    // 检查标题
    expect(screen.getByText('健康评估')).toBeInTheDocument();

    // 检查健康状态
    expect(screen.getByText('健康状态')).toBeInTheDocument();

    // 检查异常指标（如果有）
    const abnormalMetrics = analysisService.assess(mockData).abnormalMetrics;
    if (abnormalMetrics.length > 0) {
      expect(screen.getByText('异常指标')).toBeInTheDocument();
      abnormalMetrics.forEach(metric => {
        expect(screen.getByText(metric)).toBeInTheDocument();
      });
    }

    // 检查健康建议（如果有）
    const suggestions = analysisService.assess(mockData).suggestions;
    if (suggestions.length > 0) {
      expect(screen.getByText('健康建议')).toBeInTheDocument();
      suggestions.forEach(suggestion => {
        expect(screen.getByText(suggestion)).toBeInTheDocument();
      });
    }
  });

  it('应该正确处理不同类型的健康数据', () => {
    const mixedData: IHealthData[] = [
      ...mockData,
      {
        id: '4',
        type: HealthDataType.HEART_RATE,
        value: 100,
        timestamp: new Date('2023-01-04'),
        userId: 'user1'
      }
    ];

    render(<HealthAnalysis data={mixedData} />);

    // 检查是否正确显示多种类型的数据
    const assessment = analysisService.assess(mixedData);
    assessment.abnormalMetrics.forEach(metric => {
      expect(screen.getByText(metric)).toBeInTheDocument();
    });
  });

  it('应该正确处理异常值', () => {
    const dataWithExtreme: IHealthData[] = [
      ...mockData,
      {
        id: '5',
        type: HealthDataType.BLOOD_PRESSURE,
        value: 200, // 极高值
        timestamp: new Date('2023-01-05'),
        userId: 'user1'
      }
    ];

    render(<HealthAnalysis data={dataWithExtreme} />);

    // 检查是否显示危险状态
    expect(screen.getByText('存在严重健康问题')).toBeInTheDocument();
  });

  it('应该支持自定义样式', () => {
    const className = 'custom-class';
    const style = { margin: '20px' };

    const { container } = render(
      <HealthAnalysis
        data={mockData}
        className={className}
        style={style}
      />
    );

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toHaveClass(className);
    expect(rootElement).toHaveStyle(style);
  });

  it('应该正确显示动画效果', () => {
    render(<HealthAnalysis data={mockData} />);

    // 检查是否应用了动画类
    const animations = document.getElementsByClassName('animation');
    expect(animations.length).toBeGreaterThan(0);
  });
}); 