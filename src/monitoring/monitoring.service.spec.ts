import { AlertService } from '../alert/alert.service';
import { LoggerService } from '../logger/logger.service';
import { MonitoringService } from './monitoring.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('MonitoringService', () => {
  let service: MonitoringService;
  let loggerService: LoggerService;
  let alertService: AlertService;

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };

  const mockAlertService = {
    sendAlert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitoringService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: AlertService,
          useValue: mockAlertService,
        },
      ],
    }).compile();

    service = module.get<MonitoringService>(MonitoringService);
    loggerService = module.get<LoggerService>(LoggerService);
    alertService = module.get<AlertService>(AlertService);
  });

  describe('trackGamificationMetrics', () => {
    it('track metrics and log', async () => {
      const userId = '1';
      const action = 'level_up';
      const duration = 100;

      await service.trackGamificationMetrics(userId, action, duration);

      expect(loggerService.log).toHaveBeenCalledWith(
        'gamification',
        expect.objectContaining({
          userId,
          action,
          duration,
        }),
      );
    });

    it('send alert when duration exceeds threshold', async () => {
      const userId = '1';
      const action = 'level_up';
      const duration = 5000; // 超过阈值

      await service.trackGamificationMetrics(userId, action, duration);

      expect(alertService.sendAlert).toHaveBeenCalledWith(
        'performance_warning',
        expect.objectContaining({
          userId,
          action,
          duration,
        }),
      );
    });
  });
});
