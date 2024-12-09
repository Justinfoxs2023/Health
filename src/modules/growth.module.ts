import { Module } from '@nestjs/common';
import { UserGrowthModule } from './user-growth.module';
import { GrowthController } from '../controllers/growth.controller';

@Module({
  imports: [UserGrowthModule],
  controllers: [GrowthController],
  exports: []
})
export class GrowthModule {} 