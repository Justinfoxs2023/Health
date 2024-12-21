import { Schema, model, Document } from 'mongoose';

export interface IUserRelation extends Document {
  /** follower 的描述 */
  follower: Schema.Types.ObjectId; // 关注者
  /** following 的描述 */
  following: Schema.Types.ObjectId; // 被关注者
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
  /** status 的描述 */
  status: 'active' | 'blocked'; // 关系状态
  /** interactionCount 的描述 */
  interactionCount: number; // 互动次数
  /** lastInteractionAt 的描述 */
  lastInteractionAt: Date; // 最后互动时间
}

const UserRelationSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    interactionCount: {
      type: Number,
      default: 0,
    },
    lastInteractionAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    indexes: [
      { follower: 1, following: 1 },
      { following: 1, follower: 1 },
      { status: 1 },
      { createdAt: -1 },
    ],
  },
);

export const UserRelation = model<IUserRelation>('UserRelation', UserRelationSchema);
