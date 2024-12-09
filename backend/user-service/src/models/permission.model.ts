import { Schema, model, Document } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  code: string;
  description: string;
  type: 'system' | 'feature' | 'data';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema({
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
  type: {
    type: String,
    enum: ['system', 'feature', 'data'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// 索引
PermissionSchema.index({ code: 1 }, { unique: true });
PermissionSchema.index({ type: 1, status: 1 });

export const Permission = model<IPermission>('Permission', PermissionSchema); 