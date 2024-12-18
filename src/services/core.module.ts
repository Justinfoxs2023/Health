import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './config/configuration.service';
import { EventEmitter } from './events/event-emitter.service';
import { Logger } from './logger/logger.service';
import { MetricsService } from './monitoring/metrics.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  providers: [ConfigurationService, MetricsService, Logger, EventEmitter],
  exports: [ConfigurationService, MetricsService, Logger, EventEmitter],
})
export class CoreModule {}
