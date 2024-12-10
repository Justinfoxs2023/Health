import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from '../entities/reward.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>
  ) {}

  async getAvailableRewards(): Promise<Reward[]> {
    return this.rewardRepository.find({
      where: { isActive: true }
    });
  }

  async claimReward(id: string): Promise<Reward> {
    const reward = await this.rewardRepository.findOne({ where: { id } });
    if (!reward) {
      throw new Error('奖励不存在');
    }
    return reward;
  }
} 