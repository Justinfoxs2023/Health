import { Schema, model, Document } from 'mongoose';
import { HealthMetrics, ActivityData, NutritionData, SleepData, MentalHealthData } from '../types/health';

// 健康指标数据模型
const healthMetricsSchema = new Schema<HealthMetrics>({
  userId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  metrics: {
    heartRate: { type: Number, required: true },
    bloodPressure: {
      systolic: { type: Number, required: true },
      diastolic: { type: Number, required: true }
    },
    bloodOxygen: { type: Number, required: true },
    temperature: { type: Number, required: true },
    respiratoryRate: { type: Number },
    weight: { type: Number },
    bmi: { type: Number }
  },
  source: { type: String, required: true }, // 数据来源设备
  accuracy: { type: Number, required: true }, // 数据准确度
  validated: { type: Boolean, default: false } // 数据验证状态
});

// 活动数据模型
const activitySchema = new Schema<ActivityData>({
  userId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  intensity: { type: String, required: true },
  caloriesBurned: { type: Number },
  steps: { type: Number },
  distance: { type: Number },
  heartRateZones: [{
    zone: { type: String },
    duration: { type: Number }
  }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  }
});

// 营养数据模型
const nutritionSchema = new Schema<NutritionData>({
  userId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  meals: [{
    type: { type: String, required: true },
    foods: [{
      name: { type: String, required: true },
      portion: { type: Number, required: true },
      unit: { type: String, required: true },
      nutrients: {
        calories: { type: Number },
        protein: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
        fiber: { type: Number },
        vitamins: { type: Map, of: Number },
        minerals: { type: Map, of: Number }
      }
    }],
    totalCalories: { type: Number },
    imageUrl: { type: String },
    aiAnalyzed: { type: Boolean, default: false }
  }],
  waterIntake: { type: Number },
  supplements: [{
    name: { type: String },
    dose: { type: Number },
    unit: { type: String }
  }]
});

// 睡眠数据模型
const sleepSchema = new Schema<SleepData>({
  userId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  duration: { type: Number, required: true },
  quality: { type: Number, required: true },
  stages: [{
    stage: { type: String, required: true },
    duration: { type: Number, required: true }
  }],
  interruptions: { type: Number },
  environmentalFactors: {
    temperature: { type: Number },
    humidity: { type: Number },
    noise: { type: Number },
    light: { type: Number }
  },
  heartRateVariability: { type: Number }
});

// 心理健康数据模型
const mentalHealthSchema = new Schema<MentalHealthData>({
  userId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  mood: { type: String, required: true },
  stressLevel: { type: Number, required: true },
  anxiety: { type: Number },
  depression: { type: Number },
  activities: [{
    type: { type: String },
    duration: { type: Number },
    impact: { type: Number }
  }],
  notes: { type: String },
  therapySession: {
    attended: { type: Boolean },
    type: { type: String },
    notes: { type: String }
  }
});

// 索引优化
healthMetricsSchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ userId: 1, timestamp: -1, type: 1 });
nutritionSchema.index({ userId: 1, timestamp: -1 });
sleepSchema.index({ userId: 1, timestamp: -1 });
mentalHealthSchema.index({ userId: 1, timestamp: -1 });

// 数据验证和清理中间件
healthMetricsSchema.pre('save', async function(next) {
  if (this.isModified('metrics')) {
    // 数据异常检测
    const { heartRate, bloodPressure, bloodOxygen } = this.metrics;
    if (heartRate < 30 || heartRate > 200) {
      throw new Error('Invalid heart rate value');
    }
    if (bloodPressure.systolic < 70 || bloodPressure.systolic > 200) {
      throw new Error('Invalid blood pressure value');
    }
    if (bloodOxygen < 80 || bloodOxygen > 100) {
      throw new Error('Invalid blood oxygen value');
    }
  }
  next();
});

// 导出模型
export const HealthMetrics = model<HealthMetrics>('HealthMetrics', healthMetricsSchema);
export const Activity = model<ActivityData>('Activity', activitySchema);
export const Nutrition = model<NutritionData>('Nutrition', nutritionSchema);
export const Sleep = model<SleepData>('Sleep', sleepSchema);
export const MentalHealth = model<MentalHealthData>('MentalHealth', mentalHealthSchema); 