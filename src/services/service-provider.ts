import { Provider } from '@nestjs/common';

export const ServiceProviders: Provider[] = [
  UserInventoryService,
  EnhancedInventoryService,
  LogisticsService,
  EnhancedLogisticsService,
  // ... 其他服务
];
