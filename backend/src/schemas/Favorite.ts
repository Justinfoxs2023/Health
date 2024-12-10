import { Schema, model, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: Schema.Types.ObjectId;  // 用户ID
  contentType: string;  // 内容类型：post/article/exercise/diet等
  contentId: Schema.Types.ObjectId;  // 内容ID
  folder: string;  // 收藏夹名称
  note: string;  // 收藏备注
  tags: string[];  // 标签
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;  // 是否私密
}

const FavoriteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'contentType'
  },
  folder: {
    type: String,
    default: '默认收藏夹'
  },
  note: {
    type: String,
    maxLength: 500
  },
  tags: [{
    type: String,
    maxLength: 20
  }],
  isPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  indexes: [
    { userId: 1, contentType: 1 },
    { contentId: 1 },
    { folder: 1 },
    { tags: 1 },
    { createdAt: -1 }
  ]
});

export const Favorite = model<IFavorite>('Favorite', FavoriteSchema); 