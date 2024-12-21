import { CacheManagerModule } from '../cache/cache-manager.module';
import { CircuitBreakerModule } from '../reliability/circuit-breaker.module';
import { ConfigModule } from '@nestjs/config';
import { GatewayService } from './gateway.service';
import { LoadBalancerModule } from '../loadbalancer/load-balancer.module';
import { LoggerModule } from '../logger/logger.module';
import { MetricsCollectorModule } from '../monitoring/metrics-collector.module';
import { Module } from '@nestjs/common';
import { SecurityAuditorModule } from '../security/security-auditor.module';
import { ServiceDiscoveryModule } from '../discovery/service-discovery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => require('../../config/gateway.yaml')],
    }),
    LoggerModule,
    MetricsCollectorModule,
    CircuitBreakerModule,
    CacheManagerModule,
    SecurityAuditorModule,
    LoadBalancerModule,
    ServiceDiscoveryModule,
  ],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
