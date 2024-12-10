import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Statistics } from '../index';
import { HealthData, HealthMetric } from '../../../types';
import { dataStatisticsService } from '../../../services/statistics';

// Mock i18n
jest.mock('react-i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// Mock recharts
jest.mock('recharts', () => ({
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null
}));

describe('Statistics', () => {
  // 模拟健康数据
  const mockData: HealthData[] = [
    {
      id: '1',
      timestamp: new Date('2024-01-01'),
      heartRate: 75,
      bloodPressure: 120,
      bloodSugar: 5.5,
      temperature: 36.5,
      weight: 65,
      steps: 8000
    },
    {
      id: '2',
      timestamp: new Date('2024-01-02'),
      heartRate: 78,
      bloodPressure: 122,
      bloodSugar: 5.8,
      temperature: 36.6,
      weight: 65.2,
      steps: 10000
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染统计数据卡片', async () => {
    render(
      <Statistics
        data={mockData}
        selectedMetrics={[HealthMetric.HEART_RATE]}
        timeRange="week"
      />
    );

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // 检查统计数据是否显示
    expect(screen.getByText('metric.heartRate')).toBeInTheDocument();
    expect(screen.getByText(/statistics.average/)).toBeInTheDocument();
    expect(screen.getByText(/statistics.max/)).toBeInTheDocument();
    expect(screen.getByText(/statistics.min/)).toBeInTheDocument();
    expect(screen.getByText(/statistics.standardDeviation/)).toBeInTheDocument();

    // 检查图表是否渲染
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('应该显示加载状态', () => {
    render(
      <Statistics
        data={mockData}
        selectedMetrics={[HealthMetric.HEART_RATE]}
        timeRange="week"
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('应该处理空数据', async () => {
    render(
      <Statistics
        data={[]}
        selectedMetrics={[HealthMetric.HEART_RATE]}
        timeRange="week"
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // 应该仍然显示指标标题
    expect(screen.getByText('metric.heartRate')).toBeInTheDocument();
  });

  it('应该显示健康报告', async () => {
    const mockReport = {
      id: 'test_report',
      generatedAt: new Date(),
      type: 'weekly' as const,
      statistics: {
        [HealthMetric.HEART_RATE]: {
          timeRange: 'week' as const,
          totalCount: 2,
          average: 76.5,
          max: 78,
          min: 75,
          standardDeviation: 1.5,
          trend: [],
          anomalies: []
        }
      },
      recommendations: ['测试建议'],
      risks: [
        {
          level: 'low' as const,
          description: '测试风险'
        }
      ]
    };

    jest
      .spyOn(dataStatisticsService, 'generateReport')
      .mockReturnValue(mockReport);

    render(
      <Statistics
        data={mockData}
        selectedMetrics={[HealthMetric.HEART_RATE]}
        timeRange="week"
        showReport={true}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // 检查报告内容
    expect(screen.getByText('statistics.report.title')).toBeInTheDocument();
    expect(
      screen.getByText('statistics.report.recommendations')
    ).toBeInTheDocument();
    expect(screen.getByText('statistics.report.risks')).toBeInTheDocument();
    expect(screen.getByText('测试建议')).toBeInTheDocument();
    expect(screen.getByText('测试风险')).toBeInTheDocument();
  });

  it('应该处理自定义时间范围', async () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-02');

    render(
      <Statistics
        data={mockData}
        selectedMetrics={[HealthMetric.HEART_RATE]}
        timeRange="custom"
        startDate={startDate}
        endDate={endDate}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // 检查是否显示正确的数据
    expect(screen.getByText('metric.heartRate')).toBeInTheDocument();
  });

  it('应该显示异常数据提示', async () => {
    const mockStatsWithAnomalies = {
      timeRange: 'week' as const,
      totalCount: 2,
      average: 76.5,
      max: 78,
      min: 75,
      standardDeviation: 1.5,
      trend: [],
      anomalies: [
        {
          time: new Date(),
          value: 100,
          reason: '异常值'
        }
      ]
    };

    jest
      .spyOn(dataStatisticsService, 'calculateStatistics')
      .mockReturnValue(mockStatsWithAnomalies);

    render(
      <Statistics
        data={mockData}
        selectedMetrics={[HealthMetric.HEART_RATE]}
        timeRange="week"
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // 检查异常数据提示
    expect(screen.getByText('statistics.anomalies')).toBeInTheDocument();
    expect(screen.getByText(/异常值/)).toBeInTheDocument();
  });
}); 