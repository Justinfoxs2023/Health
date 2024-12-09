import { Schema, model } from 'mongoose';
import { IExercisePlan } from '../types/models';

const exercisePlanSchema = new Schema<IExercisePlan>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  goal: {
    type: String,
    required: true,
    enum: ['减重', '增肌', '塑形', '康复', '保持健康']
  },
  level: {
    type: String,
    required: true,
    enum: ['初级', '中级', '高级']
  },
  duration: {
    type: Number,
    required: true
  },
  schedule: [{
    dayOfWeek: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7],
      required: true
    },
    exercises: [{
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['有氧', '力量', '柔韧', '平衡'],
        required: true
      },
      sets: {
        type: Number,
        required: true
      },
      reps: {
        type: Number,
        required: true
      },
      weight: Number,
      duration: Number,
      restTime: {
        type: Number,
        required: true
      },
      notes: String
    }],
    totalDuration: Number,
    caloriesTarget: Number
  }],
  notes: String,
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
    enum: ['未开始', '进行中', '已完成', '已暂停'],
    default: '未开始'
  },
  progress: {
    completedWorkouts: {
      type: Number,
      default: 0
    },
    totalWorkouts: {
      type: Number,
      required: true
    },
    adherenceRate: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时自动更新updateAt字段
exercisePlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 创建索引
exercisePlanSchema.index({ userId: 1, status: 1 });
exercisePlanSchema.index({ startDate: 1, endDate: 1 });

export const ExercisePlan = model<IExercisePlan>('ExercisePlan', exercisePlanSchema); 