import { AVATAR_CUSTOMIZATION_CONFIG } from '../../config/avatar-customization.config';
import { Injectable, Logger } from '@nestjs/common';
import { TradingService } from '../marketplace/trading.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AvatarCustomizationService {
  private readonly logger = new Logger(AvatarCustomizationService.name);

  constructor(
    private readonly userService: UserService,
    private readonly tradingService: TradingService,
  ) {}

  // 获取可用装扮
  async getAvailableCustomizations(userId: string): Promise<any> {
    try {
      const userProfile = await this.userService.getUserProfile(userId);
      const unlockedItems = await this.getUnlockedItems(userProfile);
      const purchasedItems = await this.tradingService.getUserPurchases(userId, 'avatar_item');

      return {
        available: [...unlockedItems, ...purchasedItems],
        locked: await this.getLockedItems(userProfile),
        equipped: await this.getEquippedItems(userId),
      };
    } catch (error) {
      this.logger.error('获取装扮失败', error);
      throw error;
    }
  }

  // 应用装扮
  async applyCustomization(userId: string, customization: any): Promise<void> {
    try {
      await this.validateCustomization(userId, customization);
      await this.updateAvatarAppearance(userId, customization);
      await this.saveCustomizationHistory(userId, customization);
    } catch (error) {
      this.logger.error('应用装扮失败', error);
      throw error;
    }
  }

  // 处理奖励
  async processReward(userId: string, achievementType: string): Promise<void> {
    try {
      const reward = AVATAR_CUSTOMIZATION_CONFIG.rewards[achievementType];
      await this.grantReward(userId, reward);
      await this.notifyUser(userId, 'reward_granted', reward);
    } catch (error) {
      this.logger.error('处理奖励失败', error);
      throw error;
    }
  }
}
