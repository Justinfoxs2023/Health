import { Controller, Get, Post, Param } from '@nestjs/common';
import { RewardService } from '../services/reward.service';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  async getAvailableRewards() {
    return this.rewardService.getAvailableRewards();
  }

  @Post(':id/claim')
  async claimReward(@Param('id') id: string) {
    return this.rewardService.claimReward(id);
  }
} 