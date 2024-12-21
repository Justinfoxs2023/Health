import { CacheModule } from '../cache/cache.module';
import { CertificationService } from './certification.service';
import { ConfigModule } from '@nestjs/config';
import { ConsultationService } from './consultation.service';
import { ContentService } from './content.service';
import { CourseService } from './course.service';
import { DatabaseModule } from '../database/database.module';
import { EventBusModule } from '../communication/event-bus.module';
import { LoggerModule } from '../logger/logger.module';
import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    DatabaseModule,
    EventBusModule,
    CacheModule,
    StorageModule,
    NotificationModule,
    LoggerModule,
    ConfigModule,
  ],
  providers: [CertificationService, ConsultationService, CourseService, ContentService],
  exports: [CertificationService, ConsultationService, CourseService, ContentService],
})
export class ProfessionalModule {}
