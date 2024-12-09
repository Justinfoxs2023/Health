import { Schema, model } from 'mongoose';
import { IWorkoutLog } from '../types/models';

const workoutLogSchema = new Schema<IWorkoutLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'ExercisePlan'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['有氧', '力量', '柔韧', '平衡'],
    required: true
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    sets: [{
      reps: Number,
      weight: Number,
      duration: Number,
      distance: Number,
      notes: String
    }],
    restTime: Number
  }],
  heartRate: {
    avg: Number,
    max: Number,
    min: Number
  },
  caloriesBurned: {
    type: Number,
    required: true
  },
  intensity: {
    type: String,
    enum: ['低', '中', '高'],
    required: true
  },
  feeling: {
    type: String,
    enum: ['很差', '差', '一般', '好', '很好'],
    required: true
  },
  notes: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  weather: {
    temperature: Number,
    humidity: Number,
    condition: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建索引
workoutLogSchema.index({ userId: 1, date: -1 });
workoutLogSchema.index({ location: '2dsphere' });

export const WorkoutLog = model<IWorkoutLog>('WorkoutLog', workoutLogSchema); 