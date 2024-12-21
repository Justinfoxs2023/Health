import { AIService } from './ai/ai.service';
import { CommunicationService } from './communication/communication.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config/config.service';
import { DatabaseService } from './database/database.service';
import { ErrorService } from './error/error.service';
import { HealthService } from './health/health.service';
import { LoggerService } from './logger/logger.service';
import { MetricsService } from './monitoring/metrics.service';
import { Module } from '@nestjs/common';
import { NetworkService } from './network/network.service';
import { PrometheusService } from './monitoring/prometheus.service';
import { RedisService } from './cache/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    // 基础服务
    RedisService,
    MetricsService,
    NetworkService,
    PrometheusService,
    DatabaseService,
    ErrorService,
    CommunicationService,
    ConfigService,
    LoggerService,

    // 业务服务
    HealthService,
    AIService,
  ],
  exports: [
    // 基础服务
    RedisService,
    MetricsService,
    NetworkService,
    PrometheusService,
    DatabaseService,
    ErrorService,
    CommunicationService,
    ConfigService,
    LoggerService,

    // 业务服务
    HealthService,
    AIService,
  ],
})
export class ServicesModule {}
