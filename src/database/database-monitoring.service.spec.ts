import { Connection } from 'typeorm';
import { DatabaseMonitoringService } from './database-monitoring.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('DatabaseMonitoringService', () => {
  let service: DatabaseMonitoringService;
  let connection: Connection;

  const mockConnection = {
    isConnected: true,
    driver: {
      pool: {
        totalCount: 10,
        idleCount: 5,
        waitingCount: 0,
      },
    },
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseMonitoringService,
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<DatabaseMonitoringService>(DatabaseMonitoringService);
    connection = module.get<Connection>(Connection);
  });

  describe('checkDatabaseHealth', () => {
    it('check connection status', async () => {
      await service.checkDatabaseHealth();
      expect(mockConnection.isConnected).toBeTruthy();
    });

    it('check pool stats', async () => {
      const stats = await service.getConnectionPoolStats();
      expect(stats).toEqual({
        total: 10,
        idle: 5,
        waiting: 0,
      });
    });

    it('check slow queries', async () => {
      mockConnection.query.mockResolvedValueOnce([
        {
          query: 'SELECT * FROM users',
          duration: 2000,
        },
      ]);

      await service.checkSlowQueries();
      expect(mockConnection.query).toHaveBeenCalled();
    });

    it('check table sizes', async () => {
      mockConnection.query.mockResolvedValueOnce([
        {
          table_name: 'users',
          total_size: '100 MB',
          table_size: '80 MB',
          index_size: '20 MB',
        },
      ]);

      await service.checkTableSizes();
      expect(mockConnection.query).toHaveBeenCalled();
    });
  });
});
