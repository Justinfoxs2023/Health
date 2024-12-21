import { EnhancedGamificationService } from '../social/enhanced-gamification.service';
import { EventEmitter } from 'events';
import { HealthEventType } from '../../events/health.events';
import { HealthManagementService } from '../health/health-management.service';
import { ITradingItem, ITradeRecord, ITradingProfile } from '../../types/marketplace/trading.types';
import { Injectable, Logger } from '@nestjs/common';
import { InventoryItem } from '../../entities/inventory.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class TradingService {
  private readonly logger = new Logger(TradingService.name);

  constructor(
    private readonly userService: UserService,
    private readonly gamificationService: EnhancedGamificationService,
    private readonly healthService: HealthManagementService,
    private readonly eventEmitter: EventEmitter,
  ) {}

  // 上架商品
  async listItem(userId: string, item: Partial<ITradingItem>): Promise<ITradingItem> {
    try {
      // 检查用户交易权限
      const profile = await this.checkTradingEligibility(userId);

      // 创建商品记录
      const newItem = await this.createTradingItem(userId, item, profile);

      // 更新用户成就
      await this.updateTradingAchievements(userId, 'list_item');

      return newItem;
    } catch (error) {
      this.logger.error('上架商品失败', error);
      throw error;
    }
  }

  // 交易处理
  async processTrade(buyerId: string, itemId: string, tradeOptions: any): Promise<ITradeRecord> {
    try {
      // 验证交易条件
      await this.validateTradeConditions(buyerId, itemId, tradeOptions);

      // 创建交易记录
      const trade = await this.createTradeRecord(buyerId, itemId, tradeOptions);

      // 计算佣金
      const commission = await this.calculateCommission(trade);

      // 更新交易状态
      await this.updateTradeStatus(trade.id, 'completed', commission);

      // 更新游戏化奖励
      await this.processTradeRewards(buyerId, trade);

      return trade;
    } catch (error) {
      this.logger.error('处理交易失败', error);
      throw error;
    }
  }

  // 生成分享海报
  async generateTradingPoster(userId: string, itemId: string): Promise<string> {
    try {
      const item = await this.getTradingItem(itemId);
      const profile = await this.getTradingProfile(userId);

      if (!profile.tradingPrivileges.canCreatePoster) {
        throw new Error('无权限生成海报');
      }

      // 生成海报配置
      const posterConfig = await this.createPosterConfig(item, profile);

      // 生成海报URL
      const posterUrl = await this.generatePoster(posterConfig);

      return posterUrl;
    } catch (error) {
      this.logger.error('生成交易海报失败', error);
      throw error;
    }
  }

  // 更新交易成就
  private async updateTradingAchievements(userId: string, action: string): Promise<void> {
    const profile = await this.getTradingProfile(userId);

    // 检查成就条件
    const achievements = await this.checkTradingAchievements(profile, action);

    // 更新用户等级和权限
    if (achievements.length > 0) {
      await this.updateTradingPrivileges(userId, achievements);
    }
  }

  // 计算交易佣金
  private async calculateCommission(trade: ITradeRecord): Promise<number> {
    const seller = await this.getTradingProfile(trade.seller);

    // 基础佣金率
    let commissionRate = seller.commissionRate;

    // 根据交易量调整佣金率
    if (seller.tradingVolume > 10000) {
      commissionRate *= 1.2;
    }

    return trade.price * commissionRate;
  }

  // 获取健康相关商品
  async getHealthProducts(healthConditions: any): Promise<ITradingItem[]> {
    try {
      // 基于健康状况筛选商品
      const relevantProducts = await this.filterHealthProducts(healthConditions);

      // 根据用户画像排序
      const sortedProducts = await this.rankProductsByRelevance(relevantProducts, healthConditions);

      return sortedProducts;
    } catch (error) {
      this.logger.error('获取健康商品失败', error);
      throw error;
    }
  }

  // 健康商品交易完成后的回调
  async onHealthProductPurchased(userId: string, product: ITradingItem): Promise<void> {
    try {
      // 更新用户健康档案
      await this.healthService.updateHealthProfile(userId, {
        purchasedProducts: [product],
      });

      // 触发健康事件
      await this.eventEmitter.emit(HealthEventType.PROFILE_UPDATED, {
        userId,
        type: HealthEventType.PROFILE_UPDATED,
        timestamp: new Date(),
        data: { product },
      });
    } catch (error) {
      this.logger.error('处理健康商品购买失败', error);
      throw error;
    }
  }

  async listVirtualItem(userId: string, item: InventoryItem, options: any): Promise<void> {
    // 实现虚拟物品上架逻辑
  }

  async listPhysicalItem(userId: string, item: InventoryItem, options: any): Promise<void> {
    // 实现实物上架逻辑
  }

  async completeVirtualTrade(tradeId: string): Promise<void> {
    // 实现虚拟物品交易完成逻辑
  }

  async arrangeOfflineMeeting(tradeId: string): Promise<void> {
    // 实现线下交易安排逻辑
  }

  async updateTradeLogistics(tradeId: string, trackingId: string): Promise<void> {
    // 实现物流信息更新逻辑
  }
}
