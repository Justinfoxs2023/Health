import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Comment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post_id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Comment' })
  parent_id?: string;

  @Prop({ required: true })
  content: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  mentions?: string[];

  @Prop({
    type: {
      likes: { type: Number, default: 0 },
      replies: { type: Number, default: 0 },
    },
  })
  metrics: {
    likes: number;
    replies: number;
  };

  @Prop({
    type: String,
    enum: ['active', 'deleted', 'hidden'],
    default: 'active',
  })
  status: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// 添加索引以提高查询性能
CommentSchema.index({ post_id: 1, created_at: -1 });
CommentSchema.index({ user_id: 1, created_at: -1 });
CommentSchema.index({ parent_id: 1 });
CommentSchema.index({ status: 1 });
