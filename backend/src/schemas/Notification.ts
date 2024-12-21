import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  /** userId 的描述 */
  userId: Schema.Types.ObjectId; // 接收通知的用户ID
  /** type 的描述 */
  type: string; // 通知类型：mention/like/comment/follow/system等
  /** title 的描述 */
  title: string; // 通知标题
  /** content 的描述 */
  content: string; // 通知内容
  /** sender 的描述 */
  sender: Schema.Types.ObjectId; // 发送者ID（系统通知为null）
  /** relatedType 的描述 */
  relatedType: string; // 相关内容类型
  /** relatedId 的描述 */
  relatedId: Schema.Types.ObjectId; // 相关内容ID
  /** status 的描述 */
  status: 'unread' | 'read' | 'archived'; // 通知状态
  /** priority 的描述 */
  priority: 'low' | 'normal' | 'high' | 'urgent'; // 优先级
  /** metadata 的描述 */
  metadata: Record<string, any>; // 额外元数据
  /** expiresAt 的描述 */
  expiresAt: Date; // 过期时间
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    content: {
      type: String,
      required: true,
      maxLength: 500,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedType: {
      type: String,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      refPath: 'relatedType',
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    indexes: [
      { userId: 1, status: 1 },
      { userId: 1, createdAt: -1 },
      { type: 1 },
      { priority: 1 },
      { expiresAt: 1 },
      { status: 1 },
    ],
  },
);

// 添加TTL索引，自动删除过期通知
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = model<INotification>('Notification', NotificationSchema);
