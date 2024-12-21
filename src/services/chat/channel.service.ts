import { Channel, Message, User } from '../../entities';
import { IChannelConfig, ChannelType } from '../../types/chat/channel.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository()
    private channelRepo: Repository<Channel>,
    private userService: UserService,
    private aiService: AIService,
  ) {}

  // 创建频道
  async createChannel(config: IChannelConfig): Promise<Channel> {
    const channel = this.channelRepo.create(config);
    return this.channelRepo.save(channel);
  }

  // 加入频道
  async joinChannel(userId: string, channelId: string): Promise<void> {
    const [user, channel] = await Promise.all([
      this.userService.findById(userId),
      this.channelRepo.findOne(channelId),
    ]);

    // 检查权限
    await this.checkJoinPermission(user, channel);

    // 加入频道
    await this.channelRepo.update(channelId, {
      members: [...channel.members, userId],
    });
  }

  // 发送消息
  async sendMessage(userId: string, channelId: string, content: string): Promise<Message> {
    // 检查发言权限
    await this.checkSpeakPermission(userId, channelId);

    const message = await this.messageRepo.create({
      userId,
      channelId,
      content,
      timestamp: new Date(),
    });

    // 处理消息奖励
    await this.handleMessageRewards(userId, channelId, content);

    return this.messageRepo.save(message);
  }

  // 管理频道
  async manageChannel(
    userId: string,
    channelId: string,
    updates: Partial<IChannelConfig>,
  ): Promise<void> {
    // 检查管理权限
    await this.checkManagePermission(userId, channelId);

    await this.channelRepo.update(channelId, updates);
  }

  private async checkJoinPermission(user: User, channel: Channel): Promise<void> {
    // 检查等级要求
    if (user.level < channel.gamification.levelRequired) {
      throw new Error('等级不足');
    }

    // 检查频道类型权限
    switch (channel.type) {
      case 'family':
        if (!user.familyId || user.familyId !== channel.familyId) {
          throw new Error('非家庭成员');
        }
        break;
      case 'group':
        if (!channel.permissions.invite.includes(user.id)) {
          throw new Error('需要邀请');
        }
        break;
    }
  }
}
