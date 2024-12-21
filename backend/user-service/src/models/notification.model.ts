import { Schema, model, Document } from 'mongoose';

interface INotification extends Document {
  /** userId 的描述 */
  userId: string;
  /** type 的描述 */
  type: string;
  /** title 的描述 */
  title: string;
  /** message 的描述 */
  message: string;
  /** data 的描述 */
  data?: any;
  /** read 的描述 */
  read: boolean;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: Schema.Types.Mixed,
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1 });

export const NotificationModel = model<INotification>('Notification', NotificationSchema);
