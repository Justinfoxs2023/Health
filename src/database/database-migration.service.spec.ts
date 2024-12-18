import { Connection } from 'typeorm';
import { DatabaseMigrationService } from './database-migration.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('DatabaseMigrationService', () => {
  let service: DatabaseMigrationService;
  let connection: Connection;

  const mockConnection = {
    runMigrations: jest.fn(),
    undoLastMigration: jest.fn(),
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseMigrationService,
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<DatabaseMigrationService>(DatabaseMigrationService);
    connection = module.get<Connection>(Connection);
  });

  describe('runMigrations', () => {
    it('run pending migrations', async () => {
      await service.runMigrations();
      expect(mockConnection.runMigrations).toHaveBeenCalled();
    });

    it('handle migration errors', async () => {
      mockConnection.runMigrations.mockRejectedValueOnce(new Error('Migration failed'));
      await expect(service.runMigrations()).rejects.toThrow('Migration failed');
    });
  });

  describe('revertLastMigration', () => {
    it('revert last migration', async () => {
      await service.revertLastMigration();
      expect(mockConnection.undoLastMigration).toHaveBeenCalled();
    });

    it('handle revert errors', async () => {
      mockConnection.undoLastMigration.mockRejectedValueOnce(new Error('Revert failed'));
      await expect(service.revertLastMigration()).rejects.toThrow('Revert failed');
    });
  });
});
