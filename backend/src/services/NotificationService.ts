import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification, INotification } from '../schemas/Notification';
import { CacheService } from './CacheService';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationService {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<INotification>,
    private cacheService: CacheService
  ) {}

  // 获取用户通知列表
  async getNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.notificationModel
      .find({ userId, status: { $ne: 'archived' } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  // 标记通知为已读
  async markAsRead(userId: string, notificationIds: string[]) {
    await this.notificationModel.updateMany(
      {
        _id: { $in: notificationIds },
        userId
      },
      {
        $set: { status: 'read' }
      }
    );

    // 更新未读数量缓存
    await this.cacheService.invalidatePattern(`user:${userId}:unread-count`);
  }

  // 获取未读通知数量
  async getUnreadCount(userId: string): Promise<number> {
    const cacheKey = `user:${userId}:unread-count`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return parseInt(cached);
    }

    const count = await this.notificationModel.countDocuments({
      userId,
      status: 'unread'
    });

    await this.cacheService.set(cacheKey, count.toString(), 300); // 缓存5分钟
    return count;
  }

  // 创建新通知
  async createNotification(data: Partial<INotification>): Promise<INotification> {
    const notification = await this.notificationModel.create(data);
    
    // 发送实时通知
    this.sendRealTimeNotification(data.userId.toString(), notification);
    
    // 更新未读数量缓存
    await this.cacheService.invalidatePattern(`user:${data.userId}:unread-count`);
    
    return notification;
  }

  // 发送系统通知
  async sendSystemNotification(data: {
    userIds: string[];
    title: string;
    content: string;
    priority?: string;
  }) {
    const notifications = await Promise.all(
      data.userIds.map(userId =>
        this.createNotification({
          userId,
          type: 'system',
          title: data.title,
          content: data.content,
          priority: data.priority || 'normal',
          status: 'unread'
        })
      )
    );

    return notifications;
  }

  // 清理过期通知
  async cleanupExpiredNotifications() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - 90); // 90天前的通知

    await this.notificationModel.deleteMany({
      createdAt: { $lt: expiryDate },
      status: 'archived'
    });
  }

  // WebSocket连接处理
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      client.disconnect();
      return;
    }

    // 记录用户的socket连接
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(client.id);

    // 发送未读通知数量
    this.getUnreadCount(userId).then(count => {
      client.emit('unread_count', count);
    });
  }

  // WebSocket断开连接处理
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId).delete(client.id);
      if (this.userSockets.get(userId).size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  // 发送实时通知
  private sendRealTimeNotification(userId: string, notification: INotification) {
    if (this.userSockets.has(userId)) {
      const sockets = this.userSockets.get(userId);
      sockets.forEach(socketId => {
        this.server.to(socketId).emit('notification', notification);
      });
    }
  }

  // 获取通知设置
  async getNotificationSettings(userId: string) {
    const cacheKey = `user:${userId}:notification-settings`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // TODO: 从用户设置中获取通知配置
    const settings = {
      email: true,
      push: true,
      types: {
        mention: true,
        like: true,
        comment: true,
        follow: true,
        system: true
      }
    };

    await this.cacheService.set(cacheKey, JSON.stringify(settings), 3600);
    return settings;
  }

  // 更新通知设置
  async updateNotificationSettings(userId: string, settings: any) {
    // TODO: 更新用户的通知设置
    await this.cacheService.invalidatePattern(`user:${userId}:notification-settings`);
    return settings;
  }
} 