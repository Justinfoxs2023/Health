import { IUserProfile } from './profile.model';
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  /** username 的描述 */
  username: string;
  /** email 的描述 */
  email: string;
  /** phone 的描述 */
  phone?: string;
  /** password 的描述 */
  password: string;
  /** status 的描述 */
  status: 'active' | 'inactive' | 'locked';
  /** profile 的描述 */
  profile: IUserProfile;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'locked'],
      default: 'active',
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  },
);

// 索引
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { sparse: true, unique: true });
UserSchema.index({ username: 1 });
UserSchema.index({ status: 1 });

export const User = model<IUser>('User', UserSchema);
