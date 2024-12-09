export interface Post {
  id?: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  attachments?: Attachment[];
  status?: 'draft' | 'published' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}

export interface Comment {
  id?: string;
  postId: string;
  userId: string;
  content: string;
  attachments?: Attachment[];
  parentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  likeCount?: number;
}

export interface ExpertResponse {
  expertId: string;
  content: string;
  attachments?: Attachment[];
  createdAt: Date;
  rating?: number;
  feedback?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface ConsultationSession {
  id: string;
  userId: string;
  expertId: string;
  question: string;
  response?: ExpertResponse;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
} 