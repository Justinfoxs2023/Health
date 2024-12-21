import { Schema, model, Document } from 'mongoose';

export interface IUserProfile extends Document {
  /** userId 的描述 */
  userId: string;
  /** healthScore 的描述 */
  healthScore: number;
  /** healthTags 的描述 */
  healthTags: string[];
  /** preferences 的描述 */
  preferences: {
    diet?: string[];
    exercise?: string[];
    sleepHabits?: string[];
  };
  /** riskFactors 的描述 */
  riskFactors: Array<{
    type: string;
    level: string;
    description: string;
  }>;
  /** medicalHistory 的描述 */
  medicalHistory: Array<{
    condition: string;
    diagnosedDate: Date;
    status: string;
  }>;
  /** measurements 的描述 */
  measurements: {
    height?: number;
    weight?: number;
    bmi?: number;
    bloodType?: string;
  };
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const ProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    healthScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    healthTags: [
      {
        type: String,
        trim: true,
      },
    ],
    preferences: {
      diet: [String],
      exercise: [String],
      sleepHabits: [String],
    },
    riskFactors: [
      {
        type: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          enum: ['low', 'medium', 'high'],
          required: true,
        },
        description: String,
      },
    ],
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        status: {
          type: String,
          enum: ['active', 'managed', 'resolved'],
        },
      },
    ],
    measurements: {
      height: Number,
      weight: Number,
      bmi: Number,
      bloodType: String,
    },
  },
  {
    timestamps: true,
  },
);

// 索引
ProfileSchema.index({ userId: 1 }, { unique: true });
ProfileSchema.index({ healthScore: -1 });
ProfileSchema.index({ 'riskFactors.level': 1 });

export const UserProfile = model<IUserProfile>('UserProfile', ProfileSchema);
