import { dataStatisticsService, StatTimeRange } from '../index';
import { HealthData, HealthMetric } from '../../../types';

describe('DataStatisticsService', () => {
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
    },
    {
      id: '3',
      timestamp: new Date('2024-01-03'),
      heartRate: 95, // 异常值
      bloodPressure: 118,
      bloodSugar: 5.6,
      temperature: 36.5,
      weight: 65.1,
      steps: 7500
    }
  ];

  describe('calculateStatistics', () => {
    it('应该正确计算指定时间范围内的统计数据', () => {
      const stats = dataStatisticsService.calculateStatistics(
        mockData,
        HealthMetric.HEART_RATE,
        'week'
      );

      expect(stats.totalCount).toBe(3);
      expect(stats.average).toBeCloseTo(82.67, 2);
      expect(stats.max).toBe(95);
      expect(stats.min).toBe(75);
      expect(stats.standardDeviation).toBeGreaterThan(0);
      expect(stats.trend).toHaveLength(3);
      expect(stats.anomalies).toHaveLength(1);
    });

    it('应该正确处理自定义时间范围', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-02');

      const stats = dataStatisticsService.calculateStatistics(
        mockData,
        HealthMetric.HEART_RATE,
        'custom',
        startDate,
        endDate
      );

      expect(stats.totalCount).toBe(2);
      expect(stats.trend).toHaveLength(2);
    });

    it('当使用自定义时间范围但未提供日期时应抛出错误', () => {
      expect(() =>
        dataStatisticsService.calculateStatistics(
          mockData,
          HealthMetric.HEART_RATE,
          'custom'
        )
      ).toThrow();
    });
  });

  describe('generateReport', () => {
    it('应该生成包含所有指标的健康报告', () => {
      const report = dataStatisticsService.generateReport(mockData, 'daily');

      expect(report.id).toBeDefined();
      expect(report.generatedAt).toBeInstanceOf(Date);
      expect(report.type).toBe('daily');
      expect(Object.keys(report.statistics)).toHaveLength(
        Object.values(HealthMetric).length
      );
      expect(report.recommendations).toBeInstanceOf(Array);
      expect(report.risks).toBeInstanceOf(Array);
    });

    it('应该正确识别并报告异常值', () => {
      const report = dataStatisticsService.generateReport(mockData, 'daily');
      const heartRateStats = report.statistics[HealthMetric.HEART_RATE];

      expect(heartRateStats.anomalies).toHaveLength(1);
      expect(heartRateStats.anomalies[0].value).toBe(95);
    });
  });

  describe('私有方法测试', () => {
    it('calculateAverage应该正确计算平均值', () => {
      const values = [1, 2, 3, 4, 5];
      const average = (dataStatisticsService as any).calculateAverage(values);
      expect(average).toBe(3);
    });

    it('calculateStandardDeviation应该正确计算标准差', () => {
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      const stdDev = (dataStatisticsService as any).calculateStandardDeviation(
        values
      );
      expect(stdDev).toBeCloseTo(2.0, 1);
    });

    it('detectAnomalies应该正确识别异常值', () => {
      const anomalies = (dataStatisticsService as any).detectAnomalies(
        mockData,
        HealthMetric.HEART_RATE
      );
      expect(anomalies).toHaveLength(1);
      expect(anomalies[0].value).toBe(95);
    });

    it('generateRecommendations应该基于异常值生成建议', () => {
      const stats = {
        [HealthMetric.HEART_RATE]: {
          anomalies: [{ time: new Date(), value: 95, reason: 'High value' }],
          totalCount: 3
        }
      };
      const recommendations = (dataStatisticsService as any).generateRecommendations(
        stats
      );
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0]).toContain('心率');
    });

    it('assessRisks应该正确评估健康风险', () => {
      const stats = {
        [HealthMetric.HEART_RATE]: {
          anomalies: [
            { time: new Date(), value: 95, reason: 'High value' },
            { time: new Date(), value: 100, reason: 'High value' }
          ],
          totalCount: 10
        }
      };
      const risks = (dataStatisticsService as any).assessRisks(stats);
      expect(risks).toHaveLength(1);
      expect(risks[0].level).toBe('medium');
    });
  });
}); 