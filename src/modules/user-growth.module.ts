import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGrowth } from '../entities/UserGrowth';
import { UserGrowthController } from '../controllers/UserGrowthController';
import { UserGrowthService } from '../services/UserGrowthService';

@Module({
  imports: [TypeOrmModule.forFeature([UserGrowth])],
  controllers: [UserGrowthController],
  providers: [UserGrowthService],
  exports: [UserGrowthService],
})
export class UserGrowthModule {}
