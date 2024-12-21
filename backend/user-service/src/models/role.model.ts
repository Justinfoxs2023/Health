import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
  /** name 的描述 */
  name: string;
  /** code 的描述 */
  code: string;
  /** description 的描述 */
  description: string;
  /** permissions 的描述 */
  permissions: Array<{
    permissionId: string;
    grantType: 'full' | 'read' | 'write';
  }>;
  /** status 的描述 */
  status: 'active' | 'inactive';
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const RoleSchema = new Schema(
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
    permissions: [
      {
        permissionId: {
          type: Schema.Types.ObjectId,
          ref: 'Permission',
          required: true,
        },
        grantType: {
          type: String,
          enum: ['full', 'read', 'write'],
          default: 'read',
        },
      },
    ],
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
RoleSchema.index({ code: 1 }, { unique: true });
RoleSchema.index({ status: 1 });
RoleSchema.index({ 'permissions.permissionId': 1 });

export const Role = model<IRole>('Role', RoleSchema);
