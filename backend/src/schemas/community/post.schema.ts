import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category_id: string;

  @Prop([String])
  tags: string[];

  @Prop([
    {
      type: {
        type: String,
        enum: ['image', 'video', 'document'],
      },
      url: String,
      thumbnail_url: String,
    },
  ])
  media: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail_url?: string;
  }>;

  @Prop({
    type: String,
    enum: ['public', 'private', 'followers'],
    default: 'public',
  })
  visibility: string;

  @Prop({
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published',
  })
  status: string;

  @Prop({
    type: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      favorites: { type: Number, default: 0 },
    },
  })
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    favorites: number;
  };

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
