import { DatabaseBackupService } from './backup.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [DatabaseBackupService],
  exports: [DatabaseBackupService],
})
export class DatabaseBackupModule {}
