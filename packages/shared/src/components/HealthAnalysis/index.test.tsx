import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HealthAnalysis } from './index';
import { HealthDataType } from '../../types';
import { healthAnalysisService } from '../../services/analysis';

// Mock services
jest.mock('../../services/analysis', () => ({
  healthAnalysisService: {
    assessRisk: jest.fn(),
    analyzeTrend: jest.fn(),
    generateAdvice: jest.fn()
  }
}));

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('HealthAnalysis', () => {
  const mockData = [
    {
      id: '1',
      type: HealthDataType.BLOOD_PRESSURE,
      value: 120,
      timestamp: new Date('2023-01-01')
    },
    {
      id: '2',
      type: HealthDataType.BLOOD_PRESSURE,
      value: 130,
      timestamp: new Date('2023-01-02')
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (healthAnalysisService.assessRisk as jest.Mock).mockResolvedValue({
      level: 'low',
      score: 1,
      factors: ['血压偏高'],
      suggestions: ['建议减少盐分摄入']
    });
    (healthAnalysisService.analyzeTrend as jest.Mock).mockResolvedValue({
      type: 'improving',
      changeRate: 0.1,
      prediction: [135, 140, 145],
      confidence: 0.8
    });
    (healthAnalysisService.generateAdvice as jest.Mock).mockResolvedValue([
      {
        type: HealthDataType.BLOOD_PRESSURE,
        advice: '建议保持规律运动',
        priority: 2
      }
    ]);
  });

  it('should render loading state initially', () => {
    render(
      <HealthAnalysis
        data={mockData}
        type={HealthDataType.BLOOD_PRESSURE}
      />
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('should render no data message when data is empty', () => {
    render(
      <HealthAnalysis
        data={[]}
        type={HealthDataType.BLOOD_PRESSURE}
      />
    );
    expect(screen.getByText('analysis.noData')).toBeInTheDocument();
  });

  it('should render risk assessment', async () => {
    render(
      <HealthAnalysis
        data={mockData}
        type={HealthDataType.BLOOD_PRESSURE}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('analysis.riskAssessment')).toBeInTheDocument();
      expect(screen.getByText('analysis.riskLevel.low')).toBeInTheDocument();
      expect(screen.getByText('血压偏高')).toBeInTheDocument();
    });
  });

  it('should render trend analysis', async () => {
    render(
      <HealthAnalysis
        data={mockData}
        type={HealthDataType.BLOOD_PRESSURE}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('analysis.trendAnalysis')).toBeInTheDocument();
      expect(screen.getByText('analysis.trendType.improving')).toBeInTheDocument();
      expect(screen.getByText(/10.0%/)).toBeInTheDocument();
      expect(screen.getByText(/80.0%/)).toBeInTheDocument();
    });
  });

  it('should render health advice', async () => {
    render(
      <HealthAnalysis
        data={mockData}
        type={HealthDataType.BLOOD_PRESSURE}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('analysis.healthAdvice')).toBeInTheDocument();
      expect(screen.getByText('建议保持规律运动')).toBeInTheDocument();
    });
  });

  it('should handle error states', async () => {
    (healthAnalysisService.assessRisk as jest.Mock).mockRejectedValue(new Error());
    
    render(
      <HealthAnalysis
        data={mockData}
        type={HealthDataType.BLOOD_PRESSURE}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('analysis.error')).toBeInTheDocument();
    });
  });

  it('should update when data changes', async () => {
    const { rerender } = render(
      <HealthAnalysis
        data={mockData}
        type={HealthDataType.BLOOD_PRESSURE}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('analysis.riskLevel.low')).toBeInTheDocument();
    });

    const newMockData = [
      ...mockData,
      {
        id: '3',
        type: HealthDataType.BLOOD_PRESSURE,
        value: 140,
        timestamp: new Date('2023-01-03')
      }
    ];

    (healthAnalysisService.assessRisk as jest.Mock).mockResolvedValue({
      level: 'medium',
      score: 2,
      factors: ['血压持续升高'],
      suggestions: ['建议就医检查']
    });

    rerender(
      <HealthAnalysis
        data={newMockData}
        type={HealthDataType.BLOOD_PRESSURE}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('analysis.riskLevel.medium')).toBeInTheDocument();
      expect(screen.getByText('血压持续升高')).toBeInTheDocument();
    });
  });
}); 