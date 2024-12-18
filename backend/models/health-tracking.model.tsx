import { IHealthTracking } from '../types/models';
import { Schema, model } from 'mongoose';

const healthTrackingSchema = new Schema<IHealthTracking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // 日期
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },

  // 体重记录
  weight: {
    value: Number,
    unit: {
      type: String,
      default: 'kg',
    },
  },

  // 运动记录
  exercise: [
    {
      type: String,
      duration: Number, // 分钟
      intensity: {
        type: String,
        enum: ['低', '中', '高'],
      },
      caloriesBurned: Number,
    },
  ],

  // 饮食记录
  diet: {
    meals: [
      {
        type: {
          type: String,
          enum: ['早餐', '午餐', '晚餐', '加餐'],
        },
        foods: [
          {
            name: String,
            amount: Number,
            unit: String,
            calories: Number,
            nutrients: {
              protein: Number,
              fat: Number,
              carbohydrates: Number,
              fiber: Number,
            },
          },
        ],
      },
    ],
    totalCalories: Number,
    waterIntake: Number, // 毫升
  },

  // 睡眠记录
  sleep: {
    duration: Number, // 小时
    quality: {
      type: String,
      enum: ['差', '一般', '好', '很好'],
    },
    startTime: Date,
    endTime: Date,
  },

  // 生命体征
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      time: Date,
    },
    heartRate: {
      value: Number,
      time: Date,
    },
    bloodSugar: {
      value: Number,
      time: Date,
      type: {
        type: String,
        enum: ['空腹', '餐后', '随机'],
      },
    },
  },

  // 情绪记录
  mood: {
    status: {
      type: String,
      enum: ['很差', '差', '一般', '好', '很好'],
    },
    notes: String,
    factors: [String], // 影响因素
  },

  // 症状记录
  symptoms: [
    {
      name: String,
      severity: {
        type: String,
        enum: ['轻微', '中等', '严重'],
      },
      duration: Number, // 小时
      notes: String,
    },
  ],

  // 用户备注
  notes: String,
});

// 创建索引
healthTrackingSchema.index({ userId: 1, date: -1 });

export const HealthTracking = model<IHealthTracking>('HealthTracking', healthTrackingSchema);
