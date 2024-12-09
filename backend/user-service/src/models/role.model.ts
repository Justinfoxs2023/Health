import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  code: string;
  description: string;
  permissions: Array<{
    permissionId: string;
    grantType: 'full' | 'read' | 'write';
  }>;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: String,
  permissions: [{
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
      required: true
    },
    grantType: {
      type: String,
      enum: ['full', 'read', 'write'],
      default: 'read'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// 索引
RoleSchema.index({ code: 1 }, { unique: true });
RoleSchema.index({ status: 1 });
RoleSchema.index({ 'permissions.permissionId': 1 });

export const Role = model<IRole>('Role', RoleSchema); 