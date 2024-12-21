import { HealthDataExportService } from './health-data-export.service';
import { HealthDataType } from '../../types/health.types';
import { StorageService } from '../storage/storage.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthDataExportService', () => {
  let service: HealthDataExportService;
  let storageService: StorageService;

  const mockStorageService = {
    getData: jest.fn(),
    saveFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthDataExportService,
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<HealthDataExportService>(HealthDataExportService);
    storageService = module.get<StorageService>(StorageService);
  });

  describe('exportHealthData', () => {
    it('应该导出健康数据', async () => {
      const userId = '1';
      const mockData = [
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
      ];

      mockStorageService.getData.mockResolvedValue(mockData);

      const result = await service.exportHealthData(userId, {
        format: 'json',
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        },
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.fileName).toMatch(/health_data_\d+\.json/);
    });

    it('应该处理导出错误', async () => {
      const userId = '1';
      mockStorageService.getData.mockRejectedValue(new Error('数据获取失败'));

      const result = await service.exportHealthData(userId, { format: 'json' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
