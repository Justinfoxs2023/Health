import { HealthDataType } from '../types/health.types';
import { HealthValidationService } from './health-validation.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthValidationService', () => {
  let service: HealthValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthValidationService],
    }).compile();

    service = module.get<HealthValidationService>(HealthValidationService);
  });

  describe('validateHealthData', () => {
    it('validate vital signs data', () => {
      const validData = {
        type: HealthDataType.VITAL_SIGNS,
        data: {
          heartRate: 75,
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
          },
          temperature: 36.5,
        },
        timestamp: new Date(),
      };

      const result = service.validateHealthData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detect invalid data', () => {
      const invalidData = {
        type: HealthDataType.VITAL_SIGNS,
        data: {
          heartRate: 250, // 异常值
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
    it('validate data within normal range', () => {
      const result = service.validateDataRange('heartRate', 75);
      expect(result.isValid).toBe(true);
    });

    it('detect out of range values', () => {
      const result = service.validateDataRange('heartRate', 250);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('超出正常范围');
    });
  });
});
