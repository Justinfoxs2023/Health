import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';

@Injectable()
export class MembershipService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
  ) {}

  async createMembership(userId: string, level: string): Promise<any> {
    try {
      // 验证会员等级
      const levelConfig = await this.getMembershipLevel(level);
      if (!levelConfig) {
        throw new Error('无效的会员等级');
      }

      // 创建会员
      const membership = await this.databaseService.create('memberships', {
        userId,
        level,
        points: 0,
        benefits: levelConfig.benefits,
        validUntil: this.calculateValidUntil(levelConfig.duration),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 清除缓存
      await this.clearMembershipCache(userId);

      // 发送事件
      await this.eventBus.emit('membership.created', { membership });

      return membership;
    } catch (error) {
      this.logger.error('创建会员失败', error);
      throw error;
    }
  }

  async updateMembershipLevel(userId: string, newLevel: string): Promise<any> {
    try {
      // 验证新会员等级
      const levelConfig = await this.getMembershipLevel(newLevel);
      if (!levelConfig) {
        throw new Error('无效的会员等级');
      }

      // 更新会员等级
      const membership = await this.databaseService.update(
        'memberships',
        { userId },
        {
          level: newLevel,
          benefits: levelConfig.benefits,
          validUntil: this.calculateValidUntil(levelConfig.duration),
          updatedAt: new Date(),
        },
      );

      // 清除缓存
      await this.clearMembershipCache(userId);

      // 发送事件
      await this.eventBus.emit('membership.level.updated', { membership });

      return membership;
    } catch (error) {
      this.logger.error('更新会员等级失败', error);
      throw error;
    }
  }

  async updateMembershipPoints(userId: string, points: number): Promise<any> {
    try {
      // 更新积分
      const membership = await this.databaseService.update(
        'memberships',
        { userId },
        {
          $inc: { points },
          updatedAt: new Date(),
        },
      );

      // 检查是否需要升级
      await this.checkLevelUpgrade(membership);

      // 清除缓存
      await this.clearMembershipCache(userId);

      // 发送事件
      await this.eventBus.emit('membership.points.updated', { membership });

      return membership;
    } catch (error) {
      this.logger.error('更新会员积分失败', error);
      throw error;
    }
  }

  async getMembership(userId: string): Promise<any> {
    try {
      // 尝试从缓存获取
      const cacheKey = `membership:${userId}`;
      let membership = await this.cacheService.get(cacheKey);

      if (!membership) {
        // 从数据库获取
        membership = await this.databaseService.findOne('memberships', { userId });
        if (!membership) {
          throw new Error('会员不存在');
        }

        // 设置缓存
        await this.cacheService.set(cacheKey, membership, 3600);
      }

      return membership;
    } catch (error) {
      this.logger.error('获取会员信息失败', error);
      throw error;
    }
  }

  async checkMembershipBenefit(userId: string, benefitType: string): Promise<boolean> {
    try {
      const membership = await this.getMembership(userId);
      return membership.benefits.includes(benefitType);
    } catch (error) {
      this.logger.error('检查会员权益失败', error);
      throw error;
    }
  }

  private async getMembershipLevel(level: string): Promise<any> {
    // 从配置获取会员等级信息
    const levels = this.configService.get('membership.levels');
    return levels[level];
  }

  private calculateValidUntil(duration: number): Date {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + duration);
    return validUntil;
  }

  private async checkLevelUpgrade(membership: any): Promise<void> {
    const levels = this.configService.get('membership.levels');
    const currentLevel = levels[membership.level];

    // 检查是否满足升级条件
    for (const [level, config] of Object.entries(levels)) {
      if (
        config.pointsRequired > currentLevel.pointsRequired &&
        membership.points >= config.pointsRequired
      ) {
        await this.updateMembershipLevel(membership.userId, level);
        break;
      }
    }
  }

  private async clearMembershipCache(userId: string): Promise<void> {
    await this.cacheService.del(`membership:${userId}`);
  }
}
