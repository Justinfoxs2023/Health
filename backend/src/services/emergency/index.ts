/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 紧急救助服务层实现
class EmergencyService {
  constructor(
    private readonly redis: Redis,
    private readonly socket: Socket.IO,
    private readonly notification: NotificationService,
  ) {}

  // 处理紧急求助
  async handleEmergency(userId: string, eventType: EmergencyType) {
    // 创建紧急事件
    const emergency = await this.createEmergencyEvent(userId, eventType);

    // 使用Redis存储活动事件
    await this.redis.set(`emergency:${emergency.id}`, JSON.stringify(emergency));

    // 通过Socket.IO推送实时通知
    this.socket.to(`user:${userId}`).emit('emergency_alert', emergency);

    // 按优先级通知紧急联系人
    const contacts = await this.getEmergencyContacts(userId);
    for (const contact of contacts) {
      await this.notification.send(contact, {
        type: 'emergency_alert',
        data: emergency,
      });
    }
  }
}
