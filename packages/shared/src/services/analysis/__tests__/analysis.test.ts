import { analysisService } from '../index';
import { IHealthData, HealthDataType } from '../../../types';

describe('AnalysisService', () => {
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

  describe('calculateStats', () => {
    it('应该正确计算统计指标', () => {
      const stats = analysisService.calculateStats(mockData);

      expect(stats.min).toBe(120);
      expect(stats.max).toBe(160);
      expect(stats.avg).toBe(140);
      expect(stats.median).toBe(140);
      expect(stats.total).toBe(3);
      expect(stats.abnormalCount).toBeGreaterThan(0);
    });

    it('应该处理空数据', () => {
      const stats = analysisService.calculateStats([]);

      expect(stats).toEqual({
        min: 0,
        max: 0,
        avg: 0,
        std: 0,
        median: 0,
        abnormalCount: 0,
        total: 0
      });
    });
  });

  describe('analyzeTrend', () => {
    it('应该正确分析上升趋势', () => {
      const result = analysisService.analyzeTrend(mockData);

      expect(result.type).toBe('up');
      expect(result.changeRate).toBeGreaterThan(0);
      expect(result.points).toHaveLength(3);
      expect(result.prediction).toBeDefined();
    });

    it('应该处理单个数据点', () => {
      const result = analysisService.analyzeTrend([mockData[0]]);

      expect(result.type).toBe('stable');
      expect(result.changeRate).toBe(0);
      expect(result.points).toHaveLength(1);
      expect(result.prediction).toBeUndefined();
    });

    it('应该正确排序数据点', () => {
      const unsortedData = [mockData[2], mockData[0], mockData[1]];
      const result = analysisService.analyzeTrend(unsortedData);

      expect(result.points[0].timestamp).toEqual(mockData[0].timestamp);
      expect(result.points[1].timestamp).toEqual(mockData[1].timestamp);
      expect(result.points[2].timestamp).toEqual(mockData[2].timestamp);
    });
  });

  describe('assess', () => {
    it('应该正确评估健康状态', () => {
      const result = analysisService.assess(mockData);

      expect(result.status).toBeDefined();
      expect(Array.isArray(result.abnormalMetrics)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it('应该处理多种类型的数据', () => {
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

      const result = analysisService.assess(mixedData);

      expect(result.abnormalMetrics.length).toBeGreaterThanOrEqual(1);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(1);
    });

    it('应该处理空数据', () => {
      const result = analysisService.assess([]);

      expect(result.status).toBe('normal');
      expect(result.abnormalMetrics).toHaveLength(0);
      expect(result.suggestions).toHaveLength(0);
    });
  });

  describe('边界情况', () => {
    it('应该处理异常值', () => {
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

      const stats = analysisService.calculateStats(dataWithExtreme);
      const assessment = analysisService.assess(dataWithExtreme);

      expect(stats.abnormalCount).toBeGreaterThan(0);
      expect(assessment.status).toBe('danger');
    });

    it('应该处理无效的健康数据类型', () => {
      const invalidData: IHealthData[] = [
        {
          id: '6',
          type: 'INVALID_TYPE' as HealthDataType,
          value: 100,
          timestamp: new Date('2023-01-06'),
          userId: 'user1'
        }
      ];

      const result = analysisService.assess(invalidData);

      expect(result.status).toBe('normal');
      expect(result.abnormalMetrics).toHaveLength(0);
    });
  });
}); 