import { IShipmentItem, ISaleOptions } from '../../types/logistics.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryItem } from '../../entities/inventory.entity';
import { LogisticsService } from '../logistics/logistics.service';
import { Repository } from 'typeorm';
import { TradingService } from '../trading/trading.service';

@Injectable()
export class UserInventoryService {
  constructor(
    @InjectRepository()
    private readonly inventoryRepo: Repository<InventoryItem>,
    private readonly tradingService: TradingService,
    private readonly logisticsService: LogisticsService,
  ) {}

  // 转换为物流项目
  private convertToShipmentItem(item: InventoryItem): IShipmentItem {
    return {
      id: item.id,
      name: item.name,
      quantity: item.quantity ?? 1,
      weight: item.weight ?? 0,
      volume: item.volume ?? 0,
    };
  }

  // 获取用户仓库物品
  async getUserInventory(userId: string): Promise<InventoryItem[]> {
    try {
      return await this.inventoryRepo.find({
        where: { userId, status: 'available' },
      });
    } catch (error) {
      console.error('Error in user-inventory.service.ts:', '获取用户仓库失败', error);
      throw error;
    }
  }

  // 上架物品
  async listItemForSale(userId: string, itemId: string, saleOptions: ISaleOptions): Promise<void> {
    try {
      const item = await this.inventoryRepo.findOne({ where: { id: itemId } });

      if (!item) {
        throw new Error('物品不存在');
      }

      if (item.type === 'virtual') {
        await this.tradingService.listVirtualItem(userId, item, saleOptions);
      } else {
        await this.tradingService.listPhysicalItem(userId, item, saleOptions);
      }

      await this.inventoryRepo.update(itemId, { status: 'on_sale' });
    } catch (error) {
      console.error('Error in user-inventory.service.ts:', '上架物品失败', error);
      throw error;
    }
  }

  // 处理交易
  async processTrade(
    tradeId: string,
    buyerId: string,
    itemId: string,
    deliveryMethod?: string,
  ): Promise<void> {
    try {
      const item = await this.inventoryRepo.findOne(itemId);

      if (item.type === 'virtual') {
        await this.processVirtualTrade(tradeId, buyerId, item);
      } else {
        await this.processPhysicalTrade(tradeId, buyerId, item, deliveryMethod);
      }
    } catch (error) {
      console.error('Error in user-inventory.service.ts:', '处理交易失败', error);
      throw error;
    }
  }

  private async processVirtualTrade(
    tradeId: string,
    buyerId: string,
    item: InventoryItem,
  ): Promise<void> {
    await this.tradingService.completeVirtualTrade(tradeId);
    await this.transferItemOwnership(item.id, buyerId);
  }

  private async processPhysicalTrade(
    tradeId: string,
    buyerId: string,
    item: InventoryItem,
    deliveryMethod: string,
  ): Promise<void> {
    if (deliveryMethod === 'offline') {
      await this.tradingService.arrangeOfflineMeeting(tradeId);
    } else {
      const logistics = await this.processPhysicalTrade(tradeId, buyerId, item, deliveryMethod);
      await this.tradingService.updateTradeLogistics(tradeId, logistics.trackingId);
    }
  }

  async findOne(itemId: string): Promise<InventoryItem> {
    const item = await this.inventoryRepo.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }
    return item;
  }

  async transferItemOwnership(itemId: string, newOwnerId: string): Promise<void> {
    await this.inventoryRepo.update(itemId, { userId: newOwnerId });
  }
}
