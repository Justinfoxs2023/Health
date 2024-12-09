import { Schema, model, Document } from 'mongoose';
import { IUserProfile } from './profile.model';

export interface IUser extends Document {
  username: string;
  email: string;
  phone?: string;
  password: string;
  status: 'active' | 'inactive' | 'locked';
  profile: IUserProfile;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'locked'],
    default: 'active'
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
});

// 索引
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { sparse: true, unique: true });
UserSchema.index({ username: 1 });
UserSchema.index({ status: 1 });

export const User = model<IUser>('User', UserSchema); 