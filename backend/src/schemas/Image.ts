import { Schema, model, Document } from 'mongoose';

export interface IImage extends Document {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  width: number;
  height: number;
  optimized: boolean;
  optimizedUrl?: string;
  thumbnailUrl?: string;
  securityChecks: {
    type: string;
    status: 'success' | 'error' | 'warning';
    message: string;
    timestamp: number;
  }[];
  metadata: {
    uploadedBy: Schema.Types.ObjectId;
    uploadedAt: Date;
    lastModified: Date;
    hash: string;
    compression: {
      originalSize: number;
      compressedSize: number;
      ratio: number;
    };
  };
  usage: {
    accessCount: number;
    lastAccessed: Date;
    referrers: string[];
  };
  status: 'pending' | 'processing' | 'ready' | 'error';
  errorMessage?: string;
}

const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  optimized: { type: Boolean, default: false },
  optimizedUrl: String,
  thumbnailUrl: String,
  securityChecks: [{
    type: String,
    status: String,
    message: String,
    timestamp: Number
  }],
  metadata: {
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    hash: String,
    compression: {
      originalSize: Number,
      compressedSize: Number,
      ratio: Number
    }
  },
  usage: {
    accessCount: { type: Number, default: 0 },
    lastAccessed: { type: Date },
    referrers: [String]
  },
  status: { type: String, default: 'pending' },
  errorMessage: String
}, {
  timestamps: true,
  collection: 'images'
});

// 索引
ImageSchema.index({ url: 1 }, { unique: true });
ImageSchema.index({ filename: 1 });
ImageSchema.index({ 'metadata.uploadedBy': 1 });
ImageSchema.index({ status: 1 });
ImageSchema.index({ 'metadata.uploadedAt': -1 });

export const Image = model<IImage>('Image', ImageSchema); 