import { IUser } from '../types/models';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<IUser>({
  // ... 其他字段

  profile: {
    height: Number,
    weight: Number,
    age: Number,
    gender: {
      type: String,
      enum: ['男', '女', '其他'],
    },
  },

  healthData: {
    bmi: Number,
    basalMetabolicRate: Number,
  },
});

// 添加实例方法
userSchema.methods = {
  calculateBMI: function (this: IUser): number {
    if (this.profile.height && this.profile.weight) {
      const heightInMeters = this.profile.height / 100;
      return Number((this.profile.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return 0;
  },

  calculateBMR: function (this: IUser): number {
    if (this.profile.weight && this.profile.height && this.profile.age && this.profile.gender) {
      if (this.profile.gender === '男') {
        return Math.round(
          88.362 +
            13.397 * this.profile.weight +
            4.799 * this.profile.height -
            5.677 * this.profile.age,
        );
      } else if (this.profile.gender === '女') {
        return Math.round(
          447.593 +
            9.247 * this.profile.weight +
            3.098 * this.profile.height -
            4.33 * this.profile.age,
        );
      }
    }
    return 0;
  },
};

export const User = model<IUser>('User', userSchema);
