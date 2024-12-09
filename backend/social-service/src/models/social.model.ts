import { Schema, model, Document } from 'mongoose';

// 帖子接口
interface IPost extends Document {
  userId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'health_record' | 'achievement';
  mediaUrls?: string[];
  healthData?: {
    type: string;
    metrics: any;
    privacy: 'public' | 'friends' | 'private';
  };
  tags: string[];
  location?: {
    coordinates: [number, number];
    address: string;
  };
  visibility: 'public' | 'friends' | 'private';
  likes: string[];
  comments: Array<{
    userId: string;
    content: string;
    createdAt: Date;
  }>;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

// 社交关系接口
interface IRelationship extends Document {
  followerId: string;
  followingId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

// 社区接口
interface ICommunity extends Document {
  name: string;
  description: string;
  category: string;
  avatar: string;
  cover: string;
  creator: string;
  admins: string[];
  members: Array<{
    userId: string;
    role: 'member' | 'moderator' | 'admin';
    joinedAt: Date;
  }>;
  rules: string[];
  isPrivate: boolean;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 帖子模型
const PostSchema = new Schema({
  userId: { type: String, required: true, index: true },
  content: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'video', 'health_record', 'achievement']
  },
  mediaUrls: [String],
  healthData: {
    type: String,
    metrics: Schema.Types.Mixed,
    privacy: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'private'
    }
  },
  tags: [String],
  location: {
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    address: String
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  likes: [String],
  comments: [{
    userId: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  shares: { type: Number, default: 0 }
}, {
  timestamps: true
});

// 社交关系模型
const RelationshipSchema = new Schema({
  followerId: { type: String, required: true },
  followingId: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// 社区模型
const CommunitySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  category: { type: String, required: true },
  avatar: String,
  cover: String,
  creator: { type: String, required: true },
  admins: [String],
  members: [{
    userId: String,
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    },
    joinedAt: { type: Date, default: Date.now }
  }],
  rules: [String],
  isPrivate: { type: Boolean, default: false },
  memberCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// 索引
PostSchema.index({ 'location.coordinates': '2dsphere' });
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });

RelationshipSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
RelationshipSchema.index({ status: 1 });

CommunitySchema.index({ name: 'text', description: 'text' });
CommunitySchema.index({ category: 1 });
CommunitySchema.index({ memberCount: -1 });

export const Post = model<IPost>('Post', PostSchema);
export const Relationship = model<IRelationship>('Relationship', RelationshipSchema);
export const Community = model<ICommunity>('Community', CommunitySchema); 