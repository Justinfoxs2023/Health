import mongoose, { Schema, Document } from 'mongoose';

// 用户模型
export interface IUser extends Document {
  /** email 的描述 */
  email: string;
  /** password 的描述 */
  password: string;
  /** roles 的描述 */
  roles: string[];
  /** status 的描述 */
  status: 'active' | 'locked' | 'inactive';
  /** profile 的描述 */
  profile: {
    name: string;
    avatar?: string;
    phone?: string;
  };
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'locked', 'inactive'],
      default: 'active',
    },
    profile: {
      name: String,
      avatar: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>('User', UserSchema);
