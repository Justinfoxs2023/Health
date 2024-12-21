import { Schema, model, Document } from 'mongoose';

interface ISyncRecord extends Document {
  /** userId 的描述 */
  userId: string;
  /** deviceId 的描述 */
  deviceId: string;
  /** dataType 的描述 */
  dataType: string;
  /** operation 的描述 */
  operation: 'create' | 'update' | 'delete';
  /** status 的描述 */
  status: 'pending' | 'completed' | 'failed';
  /** data 的描述 */
  data: any;
  /** version 的描述 */
  version: number;
  /** conflictResolution 的描述 */
  conflictResolution?: {
    strategy: 'server_wins' | 'client_wins' | 'manual';
    resolvedData?: any;
    resolvedAt?: Date;
  };
  /** error 的描述 */
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  /** syncedAt 的描述 */
  syncedAt: Date;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const SyncRecordSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    dataType: {
      type: String,
      required: true,
      enum: [
        'health_data',
        'user_preferences',
        'activity_records',
        'diet_records',
        'medication_records',
      ],
    },
    operation: {
      type: String,
      required: true,
      enum: ['create', 'update', 'delete'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    conflictResolution: {
      strategy: {
        type: String,
        enum: ['server_wins', 'client_wins', 'manual'],
      },
      resolvedData: Schema.Types.Mixed,
      resolvedAt: Date,
    },
    error: {
      code: String,
      message: String,
      details: Schema.Types.Mixed,
    },
    syncedAt: Date,
  },
  {
    timestamps: true,
  },
);

// 索引
SyncRecordSchema.index({ userId: 1, deviceId: 1, dataType: 1 });
SyncRecordSchema.index({ status: 1, syncedAt: 1 });
SyncRecordSchema.index({ version: 1 });

export const SyncRecord = model<ISyncRecord>('SyncRecord', SyncRecordSchema);
