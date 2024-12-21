/**
 * @fileoverview TS 文件 CommunityTypes.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IPost {
  /** id 的描述 */
  id?: string;
  /** userId 的描述 */
  userId: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** tags 的描述 */
  tags: string[];
  /** attachments 的描述 */
  attachments?: IAttachment[];
  /** status 的描述 */
  status?: 'draft' | 'published' | 'archived';
  /** createdAt 的描述 */
  createdAt?: Date;
  /** updatedAt 的描述 */
  updatedAt?: Date;
  /** viewCount 的描述 */
  viewCount?: number;
  /** likeCount 的描述 */
  likeCount?: number;
  /** commentCount 的描述 */
  commentCount?: number;
}

export interface IComment {
  /** id 的描述 */
  id?: string;
  /** postId 的描述 */
  postId: string;
  /** userId 的描述 */
  userId: string;
  /** content 的描述 */
  content: string;
  /** attachments 的描述 */
  attachments?: IAttachment[];
  /** parentId 的描述 */
  parentId?: string;
  /** createdAt 的描述 */
  createdAt?: Date;
  /** updatedAt 的描述 */
  updatedAt?: Date;
  /** likeCount 的描述 */
  likeCount?: number;
}

export interface IExpertResponse {
  /** expertId 的描述 */
  expertId: string;
  /** content 的描述 */
  content: string;
  /** attachments 的描述 */
  attachments?: IAttachment[];
  /** createdAt 的描述 */
  createdAt: Date;
  /** rating 的描述 */
  rating?: number;
  /** feedback 的描述 */
  feedback?: string;
}

export interface IAttachment {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: 'image' | 'video' | 'document';
  /** url 的描述 */
  url: string;
  /** name 的描述 */
  name: string;
  /** size 的描述 */
  size: number;
  /** mimeType 的描述 */
  mimeType: string;
}

export interface IConsultationSession {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** expertId 的描述 */
  expertId: string;
  /** question 的描述 */
  question: string;
  /** response 的描述 */
  response?: IExpertResponse;
  /** status 的描述 */
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  /** createdAt 的描述 */
  createdAt: Date;
  /** completedAt 的描述 */
  completedAt?: Date;
}
