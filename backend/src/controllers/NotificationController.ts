import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from '../services/NotificationService';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // 获取通知列表
  @Get()
  async getNotifications(
    @CurrentUser() currentUser: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.notificationService.getNotifications(currentUser.id, page, limit);
  }

  // 标记通知为已读
  @Put('mark-read')
  async markAsRead(
    @CurrentUser() currentUser: any,
    @Body('notificationIds') notificationIds: string[]
  ) {
    return this.notificationService.markAsRead(currentUser.id, notificationIds);
  }

  // 获取未读通知数量
  @Get('unread-count')
  async getUnreadCount(
    @CurrentUser() currentUser: any
  ) {
    return this.notificationService.getUnreadCount(currentUser.id);
  }

  // 获取通知设置
  @Get('settings')
  async getNotificationSettings(
    @CurrentUser() currentUser: any
  ) {
    return this.notificationService.getNotificationSettings(currentUser.id);
  }

  // 更新通知设置
  @Put('settings')
  async updateNotificationSettings(
    @CurrentUser() currentUser: any,
    @Body() settings: any
  ) {
    return this.notificationService.updateNotificationSettings(currentUser.id, settings);
  }

  // 发送系统通知（仅管理员）
  @Post('system')
  async sendSystemNotification(
    @Body() data: any
  ) {
    return this.notificationService.sendSystemNotification(data);
  }

  // 清理过期通知
  @Post('cleanup')
  async cleanupExpiredNotifications() {
    return this.notificationService.cleanupExpiredNotifications();
  }

  // WebSocket连接处理
  handleConnection(client: any) {
    return this.notificationService.handleConnection(client);
  }

  // WebSocket断开连接处理
  handleDisconnect(client: any) {
    return this.notificationService.handleDisconnect(client);
  }
} 