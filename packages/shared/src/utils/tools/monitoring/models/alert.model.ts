import { Schema, model, Document } from 'mongoose';

interface IAlert extends Document {
  /** type 的描述 */
  type: string;
  /** level 的描述 */
  level: 'info' | 'warning' | 'error' | 'critical';
  /** source 的描述 */
  source: string;
  /** message 的描述 */
  message: string;
  /** details 的描述 */
  details: any;
  /** status 的描述 */
  status: 'active' | 'acknowledged' | 'resolved';
  /** acknowledgedBy 的描述 */
  acknowledgedBy?: string;
  /** resolvedBy 的描述 */
  resolvedBy?: string;
  /** notificationsSent 的描述 */
  notificationsSent: Array<{
    channel: string;
    timestamp: Date;
    status: 'success' | 'failed';
  }>;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

interface IAlertRule extends Document {
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: string;
  /** conditions 的描述 */
  conditions: Array<{
    metric: string;
    operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte';
    value: number;
    duration?: number;
  }>;
  /** level 的描述 */
  level: 'info' | 'warning' | 'error' | 'critical';
  /** enabled 的描述 */
  enabled: boolean;
  /** notificationChannels 的描述 */
  notificationChannels: string[];
  /** cooldown 的描述 */
  cooldown: number;
  /** lastTriggered 的描述 */
  lastTriggered?: Date;
  /** createdBy 的描述 */
  createdBy: string;
  /** updatedBy 的描述 */
  updatedBy: string;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const AlertSchema = new Schema(
  {
    type: { type: String, required: true, index: true },
    level: {
      type: String,
      required: true,
      enum: ['info', 'warning', 'error', 'critical'],
    },
    source: { type: String, required: true },
    message: { type: String, required: true },
    details: Schema.Types.Mixed,
    status: {
      type: String,
      required: true,
      enum: ['active', 'acknowledged', 'resolved'],
      default: 'active',
    },
    acknowledgedBy: String,
    resolvedBy: String,
    notificationsSent: [
      {
        channel: String,
        timestamp: Date,
        status: {
          type: String,
          enum: ['success', 'failed'],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const AlertRuleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    type: { type: String, required: true },
    conditions: [
      {
        metric: String,
        operator: {
          type: String,
          enum: ['gt', 'lt', 'eq', 'ne', 'gte', 'lte'],
        },
        value: Number,
        duration: Number,
      },
    ],
    level: {
      type: String,
      required: true,
      enum: ['info', 'warning', 'error', 'critical'],
    },
    enabled: { type: Boolean, default: true },
    notificationChannels: [String],
    cooldown: { type: Number, default: 300 }, // 秒
    lastTriggered: Date,
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// 索引
AlertSchema.index({ type: 1, status: 1 });
AlertSchema.index({ level: 1, createdAt: -1 });
AlertSchema.index({ source: 1 });

AlertRuleSchema.index({ type: 1, enabled: 1 });
AlertRuleSchema.index({ name: 1 }, { unique: true });

export const Alert = model<IAlert>('Alert', AlertSchema);
export const AlertRule = model<IAlertRule>('AlertRule', AlertRuleSchema);
