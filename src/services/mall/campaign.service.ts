import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { ProductService } from './product.service';

@Injectable()
export class CampaignService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
    private readonly productService: ProductService
  ) {}

  async createCampaign(campaignData: any): Promise<any> {
    try {
      // 验证活动数据
      this.validateCampaignData(campaignData);

      // 创建活动
      const campaign = await this.databaseService.create('campaigns', {
        ...campaignData,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // 如果是立即开始的活动，更新商品价格
      if (campaign.startTime <= new Date()) {
        await this.startCampaign(campaign._id);
      }

      // 清除缓存
      await this.clearCampaignCache();

      // 发送事件
      await this.eventBus.emit('campaign.created', { campaign });

      return campaign;
    } catch (error) {
      this.logger.error('创建营销活动失败', error);
      throw error;
    }
  }

  async updateCampaign(campaignId: string, updateData: any): Promise<any> {
    try {
      // 验证活动是否存在
      const existingCampaign = await this.databaseService.findOne('campaigns', { _id: campaignId });
      if (!existingCampaign) {
        throw new Error('活动不存在');
      }

      // 更新活动
      const campaign = await this.databaseService.update(
        'campaigns',
        { _id: campaignId },
        {
          ...updateData,
          updatedAt: new Date()
        }
      );

      // 清除缓存
      await this.clearCampaignCache(campaignId);

      // 发送事件
      await this.eventBus.emit('campaign.updated', { campaign });

      return campaign;
    } catch (error) {
      this.logger.error('更新营销活动失败', error);
      throw error;
    }
  }

  async startCampaign(campaignId: string): Promise<void> {
    try {
      const campaign = await this.databaseService.findOne('campaigns', { _id: campaignId });
      if (!campaign) {
        throw new Error('活动不存在');
      }

      // 更新活动状态
      await this.databaseService.update(
        'campaigns',
        { _id: campaignId },
        {
          status: 'active',
          updatedAt: new Date()
        }
      );

      // 应用活动规则
      await this.applyCampaignRules(campaign);

      // 清除缓存
      await this.clearCampaignCache(campaignId);

      // 发送事件
      await this.eventBus.emit('campaign.started', { campaign });
    } catch (error) {
      this.logger.error('启动营销活动失败', error);
      throw error;
    }
  }

  async endCampaign(campaignId: string): Promise<void> {
    try {
      const campaign = await this.databaseService.findOne('campaigns', { _id: campaignId });
      if (!campaign) {
        throw new Error('活动不存在');
      }

      // 更新活动状态
      await this.databaseService.update(
        'campaigns',
        { _id: campaignId },
        {
          status: 'ended',
          updatedAt: new Date()
        }
      );

      // 恢复商品原价
      await this.revertCampaignRules(campaign);

      // 清除缓存
      await this.clearCampaignCache(campaignId);

      // 发送事件
      await this.eventBus.emit('campaign.ended', { campaign });
    } catch (error) {
      this.logger.error('结束营销活动失败', error);
      throw error;
    }
  }

  async getCampaign(campaignId: string): Promise<any> {
    try {
      // 尝试从缓存获取
      const cacheKey = `campaign:${campaignId}`;
      let campaign = await this.cacheService.get(cacheKey);

      if (!campaign) {
        // 从数据库获取
        campaign = await this.databaseService.findOne('campaigns', { _id: campaignId });
        if (!campaign) {
          throw new Error('活动不存在');
        }

        // 设置缓存
        await this.cacheService.set(cacheKey, campaign, 3600);
      }

      return campaign;
    } catch (error) {
      this.logger.error('获取营销活动失败', error);
      throw error;
    }
  }

  async listActiveCampaigns(): Promise<any[]> {
    try {
      // 尝试从缓存获取
      const cacheKey = 'campaigns:active';
      let campaigns = await this.cacheService.get(cacheKey);

      if (!campaigns) {
        // 从数据库获取
        campaigns = await this.databaseService.find('campaigns', {
          status: 'active',
          endTime: { $gt: new Date() }
        });

        // 设置缓存
        await this.cacheService.set(cacheKey, campaigns, 300); // 5分钟缓存
      }

      return campaigns;
    } catch (error) {
      this.logger.error('获取活动营销活动列表失败', error);
      throw error;
    }
  }

  private validateCampaignData(data: any): void {
    if (!data.name || !data.type || !data.startTime || !data.endTime || !data.rules) {
      throw new Error('活动数据不完整');
    }

    if (new Date(data.startTime) >= new Date(data.endTime)) {
      throw new Error('活动结束时间必须晚于开始时间');
    }

    if (!Array.isArray(data.rules) || data.rules.length === 0) {
      throw new Error('活动规则不能为空');
    }
  }

  private async applyCampaignRules(campaign: any): Promise<void> {
    for (const rule of campaign.rules) {
      switch (rule.type) {
        case 'discount':
          await this.applyDiscount(campaign.products, rule.value);
          break;
        case 'special_price':
          await this.applySpecialPrice(campaign.products, rule.value);
          break;
        case 'bundle':
          await this.applyBundle(campaign.products, rule.value);
          break;
      }
    }
  }

  private async revertCampaignRules(campaign: any): Promise<void> {
    // 恢复商品原价
    for (const productId of campaign.products) {
      const product = await this.productService.getProduct(productId);
      await this.productService.updateProduct(productId, {
        price: product.originalPrice
      });
    }
  }

  private async applyDiscount(products: string[], discount: number): Promise<void> {
    for (const productId of products) {
      const product = await this.productService.getProduct(productId);
      await this.productService.updateProduct(productId, {
        price: product.price * (1 - discount)
      });
    }
  }

  private async applySpecialPrice(products: string[], price: number): Promise<void> {
    for (const productId of products) {
      await this.productService.updateProduct(productId, { price });
    }
  }

  private async applyBundle(products: string[], bundleConfig: any): Promise<void> {
    // 实现捆绑销售逻辑
  }

  private async clearCampaignCache(campaignId?: string): Promise<void> {
    if (campaignId) {
      await this.cacheService.del(`campaign:${campaignId}`);
    }
    await this.cacheService.del('campaigns:active');
  }
}
}
