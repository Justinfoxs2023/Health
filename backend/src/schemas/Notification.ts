import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  userId: Schema.Types.ObjectId;  // 接收通知的用户ID
  type: string;  // 通知类型：mention/like/comment/follow/system等
  title: string;  // 通知标题
  content: string;  // 通知内容
  sender: Schema.Types.ObjectId;  // 发送者ID（系统通知为null）
  relatedType: string;  // 相关内容类型
  relatedId: Schema.Types.ObjectId;  // 相关内容ID
  status: 'unread' | 'read' | 'archived';  // 通知状态
  priority: 'low' | 'normal' | 'high' | 'urgent';  // 优先级
  metadata: Record<string, any>;  // 额外元数据
  expiresAt: Date;  // 过期时间
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  content: {
    type: String,
    required: true,
    maxLength: 500
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedType: {
    type: String
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'relatedType'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true,
  indexes: [
    { userId: 1, status: 1 },
    { userId: 1, createdAt: -1 },
    { type: 1 },
    { priority: 1 },
    { expiresAt: 1 },
    { status: 1 }
  ]
});

// 添加TTL索引，自动删除过期通知
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = model<INotification>('Notification', NotificationSchema); 