import { Schema, model, Document } from 'mongoose';

// 帖子接口
interface IPost extends Document {
  /** userId 的描述 */
  userId: string;
  /** content 的描述 */
  content: string;
  /** type 的描述 */
  type: 'text' | 'image' | 'video' | 'health_record' | 'achievement';
  /** mediaUrls 的描述 */
  mediaUrls?: string[];
  /** healthData 的描述 */
  healthData?: {
    type: string;
    metrics: any;
    privacy: 'public' | 'friends' | 'private';
  };
  /** tags 的描述 */
  tags: string[];
  /** location 的描述 */
  location?: {
    coordinates: [number, number];
    address: string;
  };
  /** visibility 的描述 */
  visibility: 'public' | 'friends' | 'private';
  /** likes 的描述 */
  likes: string[];
  /** comments 的描述 */
  comments: Array<{
    userId: string;
    content: string;
    createdAt: Date;
  }>;
  /** shares 的描述 */
  shares: number;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 社交关系接口
interface IRelationship extends Document {
  /** followerId 的描述 */
  followerId: string;
  /** followingId 的描述 */
  followingId: string;
  /** status 的描述 */
  status: 'pending' | 'accepted' | 'blocked';
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 社区接口
interface ICommunity extends Document {
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** category 的描述 */
  category: string;
  /** avatar 的描述 */
  avatar: string;
  /** cover 的描述 */
  cover: string;
  /** creator 的描述 */
  creator: string;
  /** admins 的描述 */
  admins: string[];
  /** members 的描述 */
  members: Array<{
    userId: string;
    role: 'member' | 'moderator' | 'admin';
    joinedAt: Date;
  }>;
  /** rules 的描述 */
  rules: string[];
  /** isPrivate 的描述 */
  isPrivate: boolean;
  /** memberCount 的描述 */
  memberCount: number;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 帖子模型
const PostSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['text', 'image', 'video', 'health_record', 'achievement'],
    },
    mediaUrls: [String],
    healthData: {
      type: String,
      metrics: Schema.Types.Mixed,
      privacy: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'private',
      },
    },
    tags: [String],
    location: {
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      address: String,
    },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public',
    },
    likes: [String],
    comments: [
      {
        userId: String,
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    shares: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// 社交关系模型
const RelationshipSchema = new Schema(
  {
    followerId: { type: String, required: true },
    followingId: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'blocked'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

// 社区模型
const CommunitySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    category: { type: String, required: true },
    avatar: String,
    cover: String,
    creator: { type: String, required: true },
    admins: [String],
    members: [
      {
        userId: String,
        role: {
          type: String,
          enum: ['member', 'moderator', 'admin'],
          default: 'member',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    rules: [String],
    isPrivate: { type: Boolean, default: false },
    memberCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

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
