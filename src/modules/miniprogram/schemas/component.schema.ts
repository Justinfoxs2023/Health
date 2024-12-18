import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ComponentDocumentType = any;

@Schema()
export class Component {
  @Prop()
  name: string;

  @Prop()
  version: string;

  @Prop()
  config: Record<string, any>;

  @Prop()
  status: string;

  @Prop()
  performance: {
    renderTime?: number;
    memoryUsage?: number;
    lastUpdated?: Date;
  };

  @Prop()
  lifecycle?: {
    onLoad?: string;
    onShow?: string;
    onHide?: string;
    onUnload?: string;
  };
}

export const ComponentSchema = SchemaFactory.createForClass(Component);
