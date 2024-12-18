import bcrypt from 'bcryptjs';
import { IUser } from '../types/models';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  avatar: String,
  role: {
    type: String,
    enum: ['user', 'nutritionist', 'admin'],
    default: 'user',
  },
  profile: {
    gender: {
      type: String,
      enum: ['男', '女', '其他'],
    },
    age: Number,
    height: Number,
    weight: Number,
    activityLevel: {
      type: String,
      enum: ['久坐', '轻度活动', '中度活动', '重度活动'],
    },
    healthGoals: [String],
    dietaryRestrictions: [String],
  },
  healthData: {
    bmi: Number,
    bodyFat: Number,
    muscleMass: Number,
    basalMetabolicRate: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      lastChecked: Date,
    },
    bloodSugar: {
      value: Number,
      lastChecked: Date,
    },
  },
  nutritionistProfile: {
    specialties: [String],
    certification: [String],
    experience: Number,
    rating: {
      type: Number,
      default: 5.0,
    },
    availability: [
      {
        dayOfWeek: Number,
        isWorking: Boolean,
        workingHours: {
          start: String,
          end: String,
        },
        maxAppointments: Number,
      },
    ],
  },
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },
    privacy: {
      shareHealthData: {
        type: Boolean,
        default: false,
      },
      shareProgress: {
        type: Boolean,
        default: false,
      },
      publicProfile: {
        type: Boolean,
        default: true,
      },
    },
    language: {
      type: String,
      default: 'zh-CN',
    },
    timezone: {
      type: String,
      default: 'Asia/Shanghai',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// 密码加密中间件
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = new Date();
  next();
});

// 验证密码方法
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 计算BMI方法
userSchema.methods.calculateBMI = function (): number {
  if (this.profile.height && this.profile.weight) {
    const heightInMeters = this.profile.height / 100;
    return Number((this.profile.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }
  return 0;
};

// 计算基础代谢率方法
userSchema.methods.calculateBMR = function (): number {
  if (this.profile.weight && this.profile.height && this.profile.age && this.profile.gender) {
    // 使用Harris-Benedict公式
    if (this.profile.gender === '男') {
      return Math.round(
        88.362 +
          13.397 * this.profile.weight +
          4.799 * this.profile.height -
          5.677 * this.profile.age,
      );
    } else {
      return Math.round(
        447.593 +
          9.247 * this.profile.weight +
          3.098 * this.profile.height -
          4.33 * this.profile.age,
      );
    }
  }
  return 0;
};

export const User = model<IUser>('User', userSchema);
