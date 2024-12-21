import { IFriendRequest, IProfileConfig } from '../../types/social/friend.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { Repository } from 'typeorm';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository()
    private friendRequestRepo: Repository<IFriendRequest>,
    @InjectRepository()
    private profileConfigRepo: Repository<IProfileConfig>,
    private notificationService: NotificationService,
  ) {}

  // 发送好友请求
  async sendFriendRequest(
    fromUserId: string,
    toUserId: string,
    options: Partial<IFriendRequest>,
  ): Promise<IFriendRequest> {
    // 检查是否已经是好友
    const existing = await this.checkExistingFriendship(fromUserId, toUserId);
    if (existing) {
      throw new Error('已经是好友关系');
    }

    // 创建好友请求
    const request = this.friendRequestRepo.create({
      fromUserId,
      toUserId,
      status: 'pending',
      ...options,
      createdAt: new Date(),
    });

    await this.friendRequestRepo.save(request);

    // 发送通知
    await this.notificationService.sendFriendRequest(toUserId, request);

    return request;
  }

  // 处理好友请求
  async handleFriendRequest(
    requestId: string,
    action: 'accept' | 'reject' | 'block',
  ): Promise<void> {
    const request = await this.friendRequestRepo.findOne(requestId);
    if (!request) {
      throw new Error('好友请求不存在');
    }

    request.status =
      action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'blocked';

    await this.friendRequestRepo.save(request);

    // 如果接受请求,创建好友关系
    if (action === 'accept') {
      await this.createFriendship(request);
    }

    // 发送通知
    await this.notificationService.sendFriendRequestResult(request.fromUserId, action);
  }

  // 更新个人页面配置
  async updateProfileConfig(
    userId: string,
    config: Partial<IProfileConfig>,
  ): Promise<IProfileConfig> {
    const existing = await this.profileConfigRepo.findOne({
      where: { userId },
    });

    const updated = this.profileConfigRepo.merge(
      existing || {
        userId,
        basicInfo: {
          nickname: true,
          avatar: true,
          level: true,
          title: true,
          badges: true,
        },
        achievements: {
          showAll: true,
          selectedIds: [],
          hideProgress: false,
        },
        activities: {
          showTypes: ['exercise', 'diet', 'health'],
          timeRange: 30,
          maxItems: 10,
        },
        social: {
          showFriends: true,
          showGroups: true,
          showPosts: true,
          showComments: true,
        },
        healthData: {
          metrics: [],
          showTrends: false,
          aggregateOnly: true,
        },
      },
      config,
    );

    return this.profileConfigRepo.save(updated);
  }

  // 获取好友可见的个人信息
  async getFriendProfile(userId: string, friendId: string): Promise<Partial<IProfileConfig>> {
    // 检查好友关系
    const isFriend = await this.checkFriendship(userId, friendId);
    if (!isFriend) {
      throw new Error('需要成为好友才能查看');
    }

    // 获取对方的可见性设置
    const friendship = await this.getFriendshipSettings(userId, friendId);
    const profile = await this.profileConfigRepo.findOne({
      where: { userId: friendId },
    });

    // 根据可见性设置过滤数据
    return this.filterProfileByVisibility(profile, friendship.visibility);
  }

  private async createFriendship(request: IFriendRequest): Promise<void> {
    // 实现创建好友关系的逻辑
  }

  private async checkFriendship(userId: string, friendId: string): Promise<boolean> {
    // 实现检查好友关系的逻辑
    return true;
  }

  private async getFriendshipSettings(userId: string, friendId: string): Promise<IFriendRequest> {
    // 实现获取好友关系设置的逻辑
    return {} as IFriendRequest;
  }

  private filterProfileByVisibility(
    profile: IProfileConfig,
    visibility: IFriendRequest['visibility'],
  ): Partial<IProfileConfig> {
    // 实现根据可见性过滤个人信息的逻辑
    return {};
  }
}
