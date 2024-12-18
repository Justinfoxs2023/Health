import { HealthDataType } from '../../types/health.types';
import { HealthDataValidationService } from './health-data-validation.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthDataValidationService', () => {
  let service: HealthDataValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthDataValidationService],
    }).compile();

    service = module.get<HealthDataValidationService>(HealthDataValidationService);
  });

  describe('validateHealthData', () => {
    it('应该验证有效的健康数据', () => {
      const validData = {
        userId: '1',
        type: HealthDataType.VITAL_SIGNS,
        data: {
          heartRate: 75,
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
          },
          temperature: 36.5,
          bloodOxygen: 98,
        },
        timestamp: new Date(),
      };

      const result = service.validateHealthData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该检��无效数据', () => {
      const invalidData = {
        userId: '1',
        type: HealthDataType.VITAL_SIGNS,
        data: {
          heartRate: -1, // 无效值
          bloodPressure: {
            systolic: 80, // 异常值
            diastolic: 100, // 异常值
          },
        },
        timestamp: new Date(),
      };

      const result = service.validateHealthData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('validateDataRange', () => {
    it('应该验证数据范围', () => {
      const validRanges = [
        { type: 'heartRate', value: 75, expected: true },
        { type: 'systolic', value: 120, expected: true },
        { type: 'diastolic', value: 80, expected: true },
        { type: 'temperature', value: 36.5, expected: true },
        { type: 'bloodOxygen', value: 98, expected: true },
      ];

      validRanges.forEach(({ type, value, expected }) => {
        const result = service.validateDataRange(type, value);
        expect(result.isValid).toBe(expected);
      });
    });
  });
});
