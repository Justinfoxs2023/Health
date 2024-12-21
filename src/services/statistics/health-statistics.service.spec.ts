import { HealthDataType } from '../../types/health.types';
import { HealthRecord } from '../../entities/health/health-record.entity';
import { HealthStatisticsService } from './health-statistics.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('HealthStatisticsService', () => {
  let service: HealthStatisticsService;
  let repository: Repository<HealthRecord>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthStatisticsService,
        {
          provide: getRepositoryToken(HealthRecord),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<HealthStatisticsService>(HealthStatisticsService);
    repository = module.get<Repository<HealthRecord>>(getRepositoryToken(HealthRecord));
  });

  describe('calculateHealthMetrics', () => {
    it('应该计算健康指标统计数据', async () => {
      const userId = '1';
      const mockRecords = [
        {
          id: '1',
          type: HealthDataType.VITAL_SIGNS,
          data: {
            heartRate: 75,
            bloodPressure: {
              systolic: 120,
              diastolic: 80,
            },
          },
          timestamp: new Date(),
        },
        {
          id: '2',
          type: HealthDataType.ACTIVITY,
          data: {
            steps: 10000,
            distance: 7.5,
            calories: 400,
          },
          timestamp: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(mockRecords);

      const result = await service.calculateHealthMetrics(userId);

      expect(result.vitalSigns).toBeDefined();
      expect(result.activity).toBeDefined();
      expect(result.trends).toBeDefined();
    });
  });

  describe('generateHealthReport', () => {
    it('应该生成健康报告', async () => {
      const userId = '1';
      const timeRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      };

      const mockData = [
        {
          id: '1',
          type: HealthDataType.VITAL_SIGNS,
          data: { heartRate: 75 },
          timestamp: new Date('2024-01-15'),
        },
      ];

      mockRepository.find.mockResolvedValue(mockData);

      const report = await service.generateHealthReport(userId, timeRange);

      expect(report.summary).toBeDefined();
      expect(report.metrics).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.period).toEqual(timeRange);
    });
  });
});
