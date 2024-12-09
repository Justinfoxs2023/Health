import { Schema, model } from 'mongoose';
import { INutritionQA } from '../types/models';

const nutritionQASchema = new Schema<INutritionQA>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  images: [String],
  category: {
    type: String,
    required: true,
    enum: ['饮食咨询', '营养方案', '体重管理', '疾病饮食', '运动营养', '其他']
  },
  tags: [String],
  status: {
    type: String,
    enum: ['待回答', '已回答', '已关闭'],
    default: '待回答'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  answers: [{
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    images: [String],
    likes: {
      type: Number,
      default: 0
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
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

// 更新时自动更新updateAt字段
nutritionQASchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 创建索引
nutritionQASchema.index({ title: 'text', content: 'text', tags: 'text' });
nutritionQASchema.index({ userId: 1, status: 1 });
nutritionQASchema.index({ category: 1, status: 1 });

export const NutritionQA = model<INutritionQA>('NutritionQA', nutritionQASchema); 