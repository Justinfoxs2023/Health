import { CacheService } from '../cache/cache.service';
import { DatabaseHealthService } from '../database/database-health.service';
import { HealthCheckService } from './health-check.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let dbHealthService: DatabaseHealthService;
  let cacheService: CacheService;

  const mockDbHealthService = {
    check: jest.fn(),
  };

  const mockCacheService = {
    ping: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCheckService,
        {
          provide: DatabaseHealthService,
          useValue: mockDbHealthService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<HealthCheckService>(HealthCheckService);
    dbHealthService = module.get<DatabaseHealthService>(DatabaseHealthService);
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('checkHealth', () => {
    it('check all service health', async () => {
      mockDbHealthService.check.mockResolvedValue({
        isHealthy: true,
        details: { type: 'postgres' },
      });

      mockCacheService.ping.mockResolvedValue(true);

      const result = await service.check();

      expect(result.status).toBe('ok');
      expect(result.details).toEqual({
        database: {
          status: 'up',
          type: 'postgres',
        },
        cache: {
          status: 'up',
        },
      });
    });

    it('handle service failures', async () => {
      mockDbHealthService.check.mockRejectedValue(new Error('DB Error'));
      mockCacheService.ping.mockResolvedValue(false);

      const result = await service.check();

      expect(result.status).toBe('error');
      expect(result.details.database.status).toBe('down');
      expect(result.details.cache.status).toBe('down');
    });
  });
});
