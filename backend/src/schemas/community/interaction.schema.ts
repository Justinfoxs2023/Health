import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Interaction extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  target_id: string;

  @Prop({
    type: String,
    enum: ['post', 'comment'],
    required: true
  })
  target_type: string;

  @Prop({
    type: String,
    enum: ['like', 'favorite', 'share', 'report'],
    required: true
  })
  interaction_type: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction); 