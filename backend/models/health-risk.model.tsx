import mongoose, { Schema } from 'mongoose';
import { IHealthRisk } from '../types/models';

const HealthRiskSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  riskType: {
    type: String,
    enum: ['运动损伤', '过度训练', '营养不足', '疾病风险', '其他健康风险'],
    required: true
  },
  severity: {
    type: String,
    enum: ['低', '中', '高', '紧急'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  triggers: [{
    indicator: String,
    value: Number,
    threshold: Number,
    trend: String
  }],
  relatedData: {
    exercise: {
      intensity: Number,
      duration: Number,
      frequency: Number
    },
    vitals: {
      heartRate: Number,
      bloodPressure: {
        systolic: Number,
        diastolic: Number
      },
      bodyTemperature: Number
    },
    nutrition: {
      calorieIntake: Number,
      proteinIntake: Number,
      hydration: Number
    }
  },
  recommendations: [{
    type: String,
    description: String,
    priority: String,
    timeframe: String
  }],
  status: {
    type: String,
    enum: ['active', 'resolved', 'monitoring'],
    default: 'active'
  },
  handlingRecords: [{
    time: {
      type: Date,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    result: String,
    handler: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

HealthRiskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const HealthRisk = mongoose.model<IHealthRisk>('HealthRisk', HealthRiskSchema); 