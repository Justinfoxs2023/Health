import mongoose, { Schema, Document } from 'mongoose';

// 用户模型
export interface IUser extends Document {
  email: string;
  password: string;
  roles: string[];
  status: 'active' | 'locked' | 'inactive';
  profile: {
    name: string;
    avatar?: string;
    phone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String }],
  status: {
    type: String,
    enum: ['active', 'locked', 'inactive'],
    default: 'active'
  },
  profile: {
    name: String,
    avatar: String,
    phone: String
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema); 