import { Module } from '@nestjs/common';
import { Reward } from '../entities/reward.entity';
import { RewardController } from '../controllers/reward.controller';
import { RewardService } from '../services/reward.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
