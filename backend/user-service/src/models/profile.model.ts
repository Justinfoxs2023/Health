import { Schema, model, Document } from 'mongoose';

export interface IUserProfile extends Document {
  userId: string;
  healthScore: number;
  healthTags: string[];
  preferences: {
    diet?: string[];
    exercise?: string[];
    sleepHabits?: string[];
  };
  riskFactors: Array<{
    type: string;
    level: string;
    description: string;
  }>;
  medicalHistory: Array<{
    condition: string;
    diagnosedDate: Date;
    status: string;
  }>;
  measurements: {
    height?: number;
    weight?: number;
    bmi?: number;
    bloodType?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  healthScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  healthTags: [{
    type: String,
    trim: true
  }],
  preferences: {
    diet: [String],
    exercise: [String],
    sleepHabits: [String]
  },
  riskFactors: [{
    type: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    description: String
  }],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'managed', 'resolved']
    }
  }],
  measurements: {
    height: Number,
    weight: Number,
    bmi: Number,
    bloodType: String
  }
}, {
  timestamps: true
});

// 索引
ProfileSchema.index({ userId: 1 }, { unique: true });
ProfileSchema.index({ healthScore: -1 });
ProfileSchema.index({ 'riskFactors.level': 1 });

export const UserProfile = model<IUserProfile>('UserProfile', ProfileSchema); 