import { Schema, model, Document } from 'mongoose';

interface ISyncRecord extends Document {
  userId: string;
  deviceId: string;
  dataType: string;
  operation: 'create' | 'update' | 'delete';
  status: 'pending' | 'completed' | 'failed';
  data: any;
  version: number;
  conflictResolution?: {
    strategy: 'server_wins' | 'client_wins' | 'manual';
    resolvedData?: any;
    resolvedAt?: Date;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  syncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SyncRecordSchema = new Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  deviceId: { 
    type: String, 
    required: true 
  },
  dataType: { 
    type: String, 
    required: true,
    enum: [
      'health_data',
      'user_preferences',
      'activity_records',
      'diet_records',
      'medication_records'
    ]
  },
  operation: { 
    type: String, 
    required: true,
    enum: ['create', 'update', 'delete']
  },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  conflictResolution: {
    strategy: {
      type: String,
      enum: ['server_wins', 'client_wins', 'manual']
    },
    resolvedData: Schema.Types.Mixed,
    resolvedAt: Date
  },
  error: {
    code: String,
    message: String,
    details: Schema.Types.Mixed
  },
  syncedAt: Date
}, {
  timestamps: true
});

// 索引
SyncRecordSchema.index({ userId: 1, deviceId: 1, dataType: 1 });
SyncRecordSchema.index({ status: 1, syncedAt: 1 });
SyncRecordSchema.index({ version: 1 });

export const SyncRecord = model<ISyncRecord>('SyncRecord', SyncRecordSchema); 