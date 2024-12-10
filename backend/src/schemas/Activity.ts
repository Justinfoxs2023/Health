import { Schema, model, Document } from 'mongoose';

export interface IActivity extends Document {
  title: string;  // 活动标题
  description: string;  // 活动描述
  type: 'challenge' | 'event' | 'competition';  // 活动类型
  category: string;  // 活动类别：运动/饮食/心理健康等
  startDate: Date;  // 开始时间
  endDate: Date;  // 结束时间
  status: 'draft' | 'active' | 'completed' | 'cancelled';  // 活动状态
  participantLimit: number;  // 参与人数限制
  currentParticipants: number;  // 当前参与人数
  rules: string[];  // 活动规则
  rewards: {  // 奖励设置
    points: number;  // 积分奖励
    badges: string[];  // 徽章奖励
    achievements: string[];  // 成就奖励
    customRewards: Record<string, any>;  // 自定义奖励
  };
  leaderboard: {  // 排行榜设置
    enabled: boolean;
    updateFrequency: 'realtime' | 'daily' | 'weekly';
    metrics: string[];  // 排名指标
  };
  metadata: Record<string, any>;  // 额外元数据
  createdBy: Schema.Types.ObjectId;  // 创建者
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: true,
    maxLength: 2000
  },
  type: {
    type: String,
    enum: ['challenge', 'event', 'competition'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  participantLimit: {
    type: Number,
    min: 0
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  rules: [{
    type: String
  }],
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    badges: [{
      type: String
    }],
    achievements: [{
      type: String
    }],
    customRewards: {
      type: Map,
      of: Schema.Types.Mixed
    }
  },
  leaderboard: {
    enabled: {
      type: Boolean,
      default: true
    },
    updateFrequency: {
      type: String,
      enum: ['realtime', 'daily', 'weekly'],
      default: 'daily'
    },
    metrics: [{
      type: String
    }]
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  indexes: [
    { title: 1 },
    { type: 1 },
    { category: 1 },
    { status: 1 },
    { startDate: 1 },
    { endDate: 1 },
    { createdBy: 1 },
    { currentParticipants: 1 }
  ]
});

export const Activity = model<IActivity>('Activity', ActivitySchema); 