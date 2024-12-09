import { Schema, model } from 'mongoose';
import { INutrientReference } from '../types/models';

const nutrientReferenceSchema = new Schema<INutrientReference>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['宏量营养素', '维生素', '矿物质', '其他']
  },
  unit: {
    type: String,
    required: true
  },
  dailyValue: {
    default: {
      type: Number,
      required: true
    },
    byAge: [{
      range: String,
      value: Number
    }],
    byGender: {
      male: Number,
      female: Number
    },
    byLifeStage: {
      pregnancy: Number,
      lactation: Number
    }
  },
  upperLimit: Number,
  description: {
    type: String,
    required: true
  },
  foodSources: {
    type: [String],
    required: true
  },
  deficiencySymptoms: [String],
  excessSymptoms: [String],
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
nutrientReferenceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 创建索引
nutrientReferenceSchema.index({ category: 1 });
nutrientReferenceSchema.index({ name: 'text' });

export const NutrientReference = model<INutrientReference>('NutrientReference', nutrientReferenceSchema); 