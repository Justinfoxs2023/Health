import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ModerationRule extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: 'keyword' | 'regex' | 'ai';

  @Prop({ type: Object, required: true })
  criteria: {
    pattern?: string;
    keywords?: string[];
    threshold?: number;
    options?: Record<string, any>;
  };

  @Prop({
    type: String,
    enum: ['block', 'flag', 'notify'],
    required: true,
  })
  action: string;

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

@Schema()
export class ModerationLog extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  target_id: string;

  @Prop({
    type: String,
    enum: ['post', 'comment'],
    required: true,
  })
  target_type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ModerationRule' })
  rule_id?: string;

  @Prop({
    type: String,
    enum: ['auto', 'manual', 'user_report'],
    required: true,
  })
  trigger_type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  moderator_id?: string;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blocked'],
    default: 'pending',
  })
  status: string;

  @Prop()
  reason?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ModerationRuleSchema = SchemaFactory.createForClass(ModerationRule);
export const ModerationLogSchema = SchemaFactory.createForClass(ModerationLog);

// 添加索引
ModerationRuleSchema.index({ type: 1, is_active: 1 });
ModerationLogSchema.index({ target_type: 1, target_id: 1 });
ModerationLogSchema.index({ status: 1, created_at: -1 });
