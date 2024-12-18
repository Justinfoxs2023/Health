import { IUser, UserModel } from '../types/models/mongoose';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'locked'],
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

export const User = model<IUser, UserModel>('User', userSchema);
