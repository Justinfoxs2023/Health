import { GrowthController } from '../controllers/growth.controller';
import { Module } from '@nestjs/common';
import { UserGrowthModule } from './user-growth.module';

@Module({
  imports: [UserGrowthModule],
  controllers: [GrowthController],
  exports: [],
})
export class GrowthModule {}
