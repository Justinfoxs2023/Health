import { GamificationService } from '../social/gamification.service';
import { IShowcaseData, InventoryCapacity } from '../../types/showcase.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { InventoryItem } from '../../entities/inventory.entity';
import { Repository } from 'typeorm';
import { USER_LEVEL_PRIVILEGES } from '../../config/user-level-privileges.config';
import { UserService } from '../user/user.service';

@Injectable()
export class EnhancedInventoryService {
  private readonly logger = console;

  constructor(
    @InjectRepository()
    private readonly inventoryRepo: Repository<InventoryItem>,
    private readonly userService: UserService,
    private readonly gamificationService: GamificationService,
  ) {}

  // 获取用户仓库容量
  async getInventoryCapacity(userId: string): Promise<InventoryCapacity> {
    try {
      const userLevel = await this.userService.getUserLevel(userId);
      const privileges = this.getPrivilegesByLevel(userLevel);

      const currentUsage = await this.getCurrentInventoryUsage(userId);

      return {
        total: privileges.slots,
        used: currentUsage,
        available: privileges.slots - currentUsage,
        displaySlots: privileges.displaySlots,
        nextLevelUpgrade: this.getNextLevelPrivileges(userLevel),
      };
    } catch (error) {
      this.logger.error('获取仓库容量失败', error);
      throw error;
    }
  }

  // 管理展示橱窗
  async manageShowcase(userId: string, items: string[]): Promise<void> {
    try {
      const userLevel = await this.userService.getUserLevel(userId);
      const privileges = this.getShowcasePrivileges(userLevel);

      if (items.length > privileges.slots) {
        throw new Error(`展示数量超过限制(最大${privileges.slots}个)`);
      }

      await this.validateShowcaseItems(userId, items);
      await this.updateShowcase(userId, items, privileges.features);

      // 更新展示成就
      await this.gamificationService.updateProgress(userId, 'showcase_management', items.length);
    } catch (error) {
      this.logger.error('管理展示橱窗失败', error);
      throw error;
    }
  }

  // 获取用户展示橱窗
  async getShowcase(userId: string): Promise<IShowcaseData> {
    try {
      const userLevel = await this.userService.getUserLevel(userId);
      const privileges = this.getShowcasePrivileges(userLevel);
      const showcase = await this.loadUserShowcase(userId);

      return {
        items: showcase.items,
        layout: showcase.layout,
        features: privileges.features,
        statistics: await this.getShowcaseStatistics(userId),
        achievements: await this.getShowcaseAchievements(userId),
      };
    } catch (error) {
      this.logger.error('获取展示橱窗失败', error);
      throw error;
    }
  }

  private getPrivilegesByLevel(level: number): any {
    for (const [key, value] of Object.entries(USER_LEVEL_PRIVILEGES.inventoryCapacity)) {
      const requiredLevel = parseInt(key.split('_')[1]);
      if (level < requiredLevel) {
        return value;
      }
    }
    return USER_LEVEL_PRIVILEGES.inventoryCapacity.level_30;
  }

  private async getCurrentInventoryUsage(userId: string): Promise<number> {
    const items = await this.inventoryRepo.find({ where: { userId } });
    return items.length;
  }

  private getNextLevelPrivileges(level: number) {
    const nextLevel = level + 1;
    const privileges = USER_LEVEL_PRIVILEGES.inventoryCapacity[`level_${nextLevel}`];
    return {
      level: nextLevel,
      ...privileges,
    };
  }

  private async getShowcasePrivileges(level: number) {
    const privileges = USER_LEVEL_PRIVILEGES.showcasePrivileges;
    const privilege = Object.entries(privileges).find(([_, value]) => level >= value.level)?.[1];
    return privilege || privileges.basic;
  }

  private async validateShowcaseItems(userId: string, items: string[]): Promise<void> {
    const inventoryItems = await this.inventoryRepo.findByIds(items);
    if (inventoryItems.length !== items.length) {
      throw new Error('部分物品不存在或不属于该用户');
    }
  }

  private async loadUserShowcase(userId: string): Promise<IShowcaseData> {
    // 实现加载用户展示橱窗的逻辑
    return {} as IShowcaseData;
  }

  private async updateShowcase(userId: string, items: string[], features: string[]): Promise<void> {
    // 实现更新展示橱窗逻辑
  }

  private async getShowcaseStatistics(userId: string) {
    // 实现获取展示统计逻辑
    return {
      views: 0,
      likes: 0,
      shares: 0,
      sales: 0,
    };
  }

  private async getShowcaseAchievements(userId: string) {
    // 实现获取展示成就逻辑
    return [];
  }
}
