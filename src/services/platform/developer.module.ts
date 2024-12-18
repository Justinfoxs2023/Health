import { CacheModule } from '../cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { DeveloperController } from './developer.controller';
import { DeveloperService } from './developer.service';
import { LoggerModule } from '../logger/logger.module';
import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { SecurityModule } from '../security/security.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => require('../../config/developer.yaml')],
    }),
    DatabaseModule,
    CacheModule,
    SecurityModule,
    LoggerModule,
    StorageModule,
    NotificationModule,
  ],
  controllers: [DeveloperController],
  providers: [DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperModule {}
