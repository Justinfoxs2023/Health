import { Controller, Get, Post, Param } from '@nestjs/common';
import { RewardService } from '../services/reward.service';

@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  async getAvailableRewards() {
    return this.rewardService.getAvailableRewards();
  }

  @Post()
  async claimReward(@Param() id: string) {
    return this.rewardService.claimReward(id);
  }
}
