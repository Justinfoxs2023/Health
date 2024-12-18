import { CacheModule } from '../cache/cache.module';
import { CampaignService } from './campaign.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { EventBusModule } from '../communication/event-bus.module';
import { IntegrationModule } from '../integration/integration.module';
import { LoggerModule } from '../logger/logger.module';
import { LogisticsService } from './logistics.service';
import { MembershipService } from './membership.service';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { ProductService } from './product.service';

@Module({
  imports: [
    DatabaseModule,
    EventBusModule,
    CacheModule,
    IntegrationModule,
    LoggerModule,
    ConfigModule,
  ],
  providers: [
    ProductService,
    OrderService,
    PaymentService,
    LogisticsService,
    MembershipService,
    CampaignService,
  ],
  exports: [
    ProductService,
    OrderService,
    PaymentService,
    LogisticsService,
    MembershipService,
    CampaignService,
  ],
})
export class MallModule {}
