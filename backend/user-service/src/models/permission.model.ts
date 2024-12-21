import { Schema, model, Document } from 'mongoose';

export interface IPermission extends Document {
  /** name 的描述 */
  name: string;
  /** code 的描述 */
  code: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: 'system' | 'feature' | 'data';
  /** status 的描述 */
  status: 'active' | 'inactive';
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['system', 'feature', 'data'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

// 索引
PermissionSchema.index({ code: 1 }, { unique: true });
PermissionSchema.index({ type: 1, status: 1 });

export const Permission = model<IPermission>('Permission', PermissionSchema);
