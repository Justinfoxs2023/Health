import { Schema, model } from 'mongoose';
import { INutritionArticle } from '../types/models';

const nutritionArticleSchema = new Schema<INutritionArticle>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['营养知识', '健康饮食', '疾病饮食', '运动营养', '特殊人群', '食品安全']
  },
  tags: [String],
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  coverImage: String,
  readCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['草稿', '待审核', '已发布', '已下线'],
    default: '草稿'
  },
  publishedAt: Date,
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
nutritionArticleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 创建索引
nutritionArticleSchema.index({ title: 'text', tags: 'text' });
nutritionArticleSchema.index({ category: 1, status: 1 });
nutritionArticleSchema.index({ author: 1, status: 1 });

export const NutritionArticle = model<INutritionArticle>('NutritionArticle', nutritionArticleSchema); 