import { Schema, model, Document } from 'mongoose';

interface IAlert extends Document {
  type: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  details: any;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  resolvedBy?: string;
  notificationsSent: Array<{
    channel: string;
    timestamp: Date;
    status: 'success' | 'failed';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface IAlertRule extends Document {
  name: string;
  description: string;
  type: string;
  conditions: Array<{
    metric: string;
    operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte';
    value: number;
    duration?: number;
  }>;
  level: 'info' | 'warning' | 'error' | 'critical';
  enabled: boolean;
  notificationChannels: string[];
  cooldown: number;
  lastTriggered?: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema({
  type: { type: String, required: true, index: true },
  level: {
    type: String,
    required: true,
    enum: ['info', 'warning', 'error', 'critical']
  },
  source: { type: String, required: true },
  message: { type: String, required: true },
  details: Schema.Types.Mixed,
  status: {
    type: String,
    required: true,
    enum: ['active', 'acknowledged', 'resolved'],
    default: 'active'
  },
  acknowledgedBy: String,
  resolvedBy: String,
  notificationsSent: [{
    channel: String,
    timestamp: Date,
    status: {
      type: String,
      enum: ['success', 'failed']
    }
  }]
}, {
  timestamps: true
});

const AlertRuleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  type: { type: String, required: true },
  conditions: [{
    metric: String,
    operator: {
      type: String,
      enum: ['gt', 'lt', 'eq', 'ne', 'gte', 'lte']
    },
    value: Number,
    duration: Number
  }],
  level: {
    type: String,
    required: true,
    enum: ['info', 'warning', 'error', 'critical']
  },
  enabled: { type: Boolean, default: true },
  notificationChannels: [String],
  cooldown: { type: Number, default: 300 }, // 秒
  lastTriggered: Date,
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true }
}, {
  timestamps: true
});

// 索引
AlertSchema.index({ type: 1, status: 1 });
AlertSchema.index({ level: 1, createdAt: -1 });
AlertSchema.index({ source: 1 });

AlertRuleSchema.index({ type: 1, enabled: 1 });
AlertRuleSchema.index({ name: 1 }, { unique: true });

export const Alert = model<IAlert>('Alert', AlertSchema);
export const AlertRule = model<IAlertRule>('AlertRule', AlertRuleSchema); 