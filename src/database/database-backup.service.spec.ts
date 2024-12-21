import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { DatabaseBackupService } from './database-backup.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('DatabaseBackupService', () => {
  let service: DatabaseBackupService;
  let connection: Connection;
  let configService: ConfigService;

  const mockConnection = {
    query: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseBackupService,
        {
          provide: Connection,
          useValue: mockConnection,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<DatabaseBackupService>(DatabaseBackupService);
    connection = module.get<Connection>(Connection);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('createBackup', () => {
    it('create database backup', async () => {
      const backupPath = '/backups/db_backup.sql';
      mockConfigService.get.mockReturnValue(backupPath);

      await service.createBackup();

      expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('pg_dump'));
    });
  });

  describe('restoreBackup', () => {
    it('restore database from backup', async () => {
      const backupPath = '/backups/db_backup.sql';

      await service.restoreBackup(backupPath);

      expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('psql'));
    });
  });
});
