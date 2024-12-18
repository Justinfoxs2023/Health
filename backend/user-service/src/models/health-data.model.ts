import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthData extends Document {
  /** userId 的描述 */
  userId: string;
  /** type 的描述 */
  type: string;
  /** metrics 的描述 */
  metrics: {
    heartRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    bloodSugar?: number;
    weight?: number;
    height?: number;
    temperature?: number;
    oxygenSaturation?: number;
    sleepDuration?: number;
    steps?: number;
  };
  /** timestamp 的描述 */
  timestamp: Date;
  /** source 的描述 */
  source: string;
  /** deviceInfo 的描述 */
  deviceInfo?: {
    deviceId: string;
    deviceType: string;
    manufacturer: string;
  };
  /** tags 的描述 */
  tags?: string[];
  /** notes 的描述 */
  notes?: string;
}

const HealthDataSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['vital', 'activity', 'sleep', 'nutrition'],
    },
    metrics: {
      heartRate: Number,
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      bloodSugar: Number,
      weight: Number,
      height: Number,
      temperature: Number,
      oxygenSaturation: Number,
      sleepDuration: Number,
      steps: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    source: {
      type: String,
      required: true,
    },
    deviceInfo: {
      deviceId: String,
      deviceType: String,
      manufacturer: String,
    },
    tags: [String],
    notes: String,
  },
  {
    timestamps: true,
  },
);

export const HealthData = mongoose.model<IHealthData>('HealthData', HealthDataSchema);
