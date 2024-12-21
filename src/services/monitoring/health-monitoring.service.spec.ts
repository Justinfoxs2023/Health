import { AlertService } from '../alert/alert.service';
import { HealthDataType } from '../../types/health.types';
import { HealthMonitoringService } from './health-monitoring.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthMonitoringService', () => {
  let service: HealthMonitoringService;
  let alertService: AlertService;

  const mockAlertService = {
    sendAlert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthMonitoringService,
        {
          provide: AlertService,
          useValue: mockAlertService,
        },
      ],
    }).compile();

    service = module.get<HealthMonitoringService>(HealthMonitoringService);
    alertService = module.get<AlertService>(AlertService);
  });

  describe('monitorVitalSigns', () => {
    it('应该监控生命体征并发送警报', async () => {
      const userId = '1';
      const vitalSigns = {
        type: HealthDataType.VITAL_SIGNS,
        data: {
          heartRate: 150, // 异常值
          bloodPressure: {
            systolic: 180, // 异常值
            diastolic: 110, // 异常值
          },
          temperature: 39.5, // 异常值
        },
        timestamp: new Date(),
      };

      await service.monitorVitalSigns(userId, vitalSigns);

      expect(mockAlertService.sendAlert).toHaveBeenCalledTimes(4);
      expect(mockAlertService.sendAlert).toHaveBeenCalledWith(
        'vital_signs_alert',
        expect.objectContaining({
          userId,
          type: 'critical',
        }),
      );
    });

    it('应该处理正常范围内的数据', async () => {
      const userId = '1';
      const vitalSigns = {
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

      await service.monitorVitalSigns(userId, vitalSigns);

      expect(mockAlertService.sendAlert).not.toHaveBeenCalled();
    });
  });
});
