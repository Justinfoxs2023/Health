import { DataValidationService } from '../validation/data-validation.service';
import { HealthDataSyncService } from './health-data-sync.service';
import { HealthDataType } from '../../types/health.types';
import { StorageService } from '../storage/storage.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthDataSyncService', () => {
  let service: HealthDataSyncService;
  let validationService: DataValidationService;
  let storageService: StorageService;

  const mockValidationService = {
    validateHealthData: jest.fn(),
    validateBatch: jest.fn(),
  };

  const mockStorageService = {
    saveData: jest.fn(),
    batchSave: jest.fn(),
    getLastSyncTime: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthDataSyncService,
        {
          provide: DataValidationService,
          useValue: mockValidationService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<HealthDataSyncService>(HealthDataSyncService);
    validationService = module.get<DataValidationService>(DataValidationService);
    storageService = module.get<StorageService>(StorageService);
  });

  describe('syncHealthData', () => {
    it('应该成功同步健康数据', async () => {
      const userId = '1';
      const healthData = {
        type: HealthDataType.VITAL_SIGNS,
        data: {
          heartRate: 75,
          bloodPressure: { systolic: 120, diastolic: 80 },
        },
        timestamp: new Date(),
      };

      mockValidationService.validateHealthData.mockResolvedValue({ isValid: true });
      mockStorageService.saveData.mockResolvedValue({ id: '1' });

      const result = await service.syncHealthData(userId, healthData);

      expect(result.success).toBe(true);
      expect(result.syncedData).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('应该处理无效数据', async () => {
      const userId = '1';
      const invalidData = {
        type: HealthDataType.VITAL_SIGNS,
        data: {
          heartRate: -1, // 无效值
        },
        timestamp: new Date(),
      };

      mockValidationService.validateHealthData.mockResolvedValue({
        isValid: false,
        errors: ['心率值无效'],
      });

      const result = await service.syncHealthData(userId, invalidData);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('心率值无效');
    });
  });

  describe('batchSync', () => {
    it('应该成功批量同步数据', async () => {
      const userId = '1';
      const batchData = [
        {
          type: HealthDataType.VITAL_SIGNS,
          data: { heartRate: 75 },
          timestamp: new Date(),
        },
        {
          type: HealthDataType.ACTIVITY,
          data: { steps: 10000 },
          timestamp: new Date(),
        },
      ];

      mockValidationService.validateBatch.mockResolvedValue({ isValid: true });
      mockStorageService.batchSave.mockResolvedValue({ count: 2 });

      const result = await service.batchSync(userId, batchData);

      expect(result.success).toBe(true);
      expect(result.syncedCount).toBe(2);
      expect(result.failedItems).toHaveLength(0);
    });
  });
});
