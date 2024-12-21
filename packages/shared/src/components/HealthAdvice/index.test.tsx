import React from 'react';

import { HealthAdvice } from './index';
import { HealthDataType } from '../../types';
import { healthAnalysisService } from '../../services/analysis';
import { render, screen, waitFor } from '@testing-library/react';

// Mock services
jest.mock('../../services/analysis', () => ({
  healthAnalysisService: {
    generateAdvice: jest.fn(),
  },
}));

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('HealthAdvice', () => {
  const mockData = [
    {
      id: '1',
      type: HealthDataType.BLOOD_PRESSURE,
      value: 120,
      timestamp: new Date('2023-01-01'),
    },
    {
      id: '2',
      type: HealthDataType.HEART_RATE,
      value: 80,
      timestamp: new Date('2023-01-02'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (healthAnalysisService.generateAdvice as jest.Mock).mockResolvedValue([
      {
        type: HealthDataType.BLOOD_PRESSURE,
        advice: '建议减少盐分摄入',
        priority: 3,
      },
      {
        type: HealthDataType.HEART_RATE,
        advice: '建议保持���律运动',
        priority: 2,
      },
    ]);
  });

  it('render loading state initially', () => {
    render(<HealthAdvice data={mockData} />);
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('render no data message when data is empty', () => {
    render(<HealthAdvice data={[]} />);
    expect(screen.getByText('advice.noData')).toBeInTheDocument();
  });

  it('render advice cards', async () => {
    render(<HealthAdvice data={mockData} />);

    await waitFor(() => {
      expect(screen.getByText('advice.title')).toBeInTheDocument();
      expect(screen.getByText('healthData.type.BLOOD_PRESSURE')).toBeInTheDocument();
      expect(screen.getByText('healthData.type.HEART_RATE')).toBeInTheDocument();
      expect(screen.getByText('建议减少盐分摄入')).toBeInTheDocument();
      expect(screen.getByText('建议保持规律运动')).toBeInTheDocument();
    });
  });

  it('render priority indicators', async () => {
    render(<HealthAdvice data={mockData} />);

    await waitFor(() => {
      const highPriorityAdvice = screen
        .getByText('建议减少盐分摄入')
        .closest('div')
        ?.closest('div');
      const mediumPriorityAdvice = screen
        .getByText('建议保持规律运动')
        .closest('div')
        ?.closest('div');

      expect(highPriorityAdvice).toHaveClass('border-red-500');
      expect(mediumPriorityAdvice).toHaveClass('border-yellow-500');
    });
  });

  it('render comprehensive advice section', async () => {
    render(<HealthAdvice data={mockData} />);

    await waitFor(() => {
      expect(screen.getByText('advice.comprehensive')).toBeInTheDocument();
      expect(screen.getByText('advice.comprehensiveTitle')).toBeInTheDocument();
      expect(screen.getByText('advice.lifestyle')).toBeInTheDocument();
      expect(screen.getByText('advice.exercise')).toBeInTheDocument();
      expect(screen.getByText('advice.diet')).toBeInTheDocument();
      expect(screen.getByText('advice.sleep')).toBeInTheDocument();
      expect(screen.getByText('advice.stress')).toBeInTheDocument();
    });
  });

  it('handle error states', async () => {
    (healthAnalysisService.generateAdvice as jest.Mock).mockRejectedValue(new Error());

    render(<HealthAdvice data={mockData} />);

    await waitFor(() => {
      expect(screen.getByText('advice.error')).toBeInTheDocument();
    });
  });

  it('update when data changes', async () => {
    const { rerender } = render(<HealthAdvice data={mockData} />);

    await waitFor(() => {
      expect(screen.getByText('建议减少盐分摄入')).toBeInTheDocument();
    });

    const newMockData = [
      ...mockData,
      {
        id: '3',
        type: HealthDataType.BLOOD_SUGAR,
        value: 6.0,
        timestamp: new Date('2023-01-03'),
      },
    ];

    (healthAnalysisService.generateAdvice as jest.Mock).mockResolvedValue([
      {
        type: HealthDataType.BLOOD_SUGAR,
        advice: '血糖控制良好',
        priority: 1,
      },
    ]);

    rerender(<HealthAdvice data={newMockData} />);

    await waitFor(() => {
      expect(screen.getByText('血糖控制良好')).toBeInTheDocument();
      expect(screen.getByText('healthData.type.BLOOD_SUGAR')).toBeInTheDocument();
    });
  });

  it('apply custom className and style', () => {
    const { container } = render(
      <HealthAdvice data={mockData} className="custom-class" style={{ margin: '20px' }} />,
    );

    const component = container.firstChild as HTMLElement;
    expect(component).toHaveClass('custom-class');
    expect(component).toHaveStyle({ margin: '20px' });
  });
});
