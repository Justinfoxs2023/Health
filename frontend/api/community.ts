import { ApiResponse } from './types';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  media: {
    type: 'image' | 'video';
    uri: string;
    thumbnailUri?: string;
  }[];
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
  type: 'experience' | 'question' | 'challenge';
}

export interface PostDetail extends Post {
  comments: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: string;
    likes: number;
    liked: boolean;
  }[];
  liked: boolean;
}

export const getPosts = async (): Promise<ApiResponse<Post[]>> => {
  const response = await fetch('/api/community/posts');
  return response.json();
};

export const getPostDetail = async (id: string): Promise<ApiResponse<PostDetail>> => {
  const response = await fetch(`/api/community/posts/${id}`);
  return response.json();
};

export const createPost = async (data: {
  content: string;
  type: 'experience' | 'question' | 'challenge';
  media: {
    type: 'image' | 'video';
    uri: string;
    thumbnailUri?: string;
  }[];
}): Promise<ApiResponse<void>> => {
  const response = await fetch('/api/community/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const likePost = async (postId: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`/api/community/posts/${postId}/like`, {
    method: 'POST'
  });
  return response.json();
};

export const createComment = async (data: {
  postId: string;
  content: string;
}): Promise<ApiResponse<void>> => {
  const response = await fetch('/api/community/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}; 