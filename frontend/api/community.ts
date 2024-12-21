import { IApiResponse } from './types';

export interface IPost {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** userName 的描述 */
  userName: string;
  /** userAvatar 的描述 */
  userAvatar: string;
  /** content 的描述 */
  content: string;
  /** media 的描述 */
  media: {
    type: 'image' | 'video';
    uri: string;
    thumbnailUri?: string;
  }[];
  /** likes 的描述 */
  likes: number;
  /** comments 的描述 */
  comments: number;
  /** tags 的描述 */
  tags: string[];
  /** createdAt 的描述 */
  createdAt: string;
  /** type 的描述 */
  type: 'experience' | 'question' | 'challenge';
}

export interface IPostDetail extends IPost {
  /** comments 的描述 */
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
  /** liked 的描述 */
  liked: boolean;
}

export const getPosts = async (): Promise<IApiResponse<IPost[]>> => {
  const response = await fetch('/api/community/posts');
  return response.json();
};

export const getPostDetail = async (id: string): Promise<IApiResponse<IPostDetail>> => {
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
}): Promise<IApiResponse<void>> => {
  const response = await fetch('/api/community/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const likePost = async (postId: string): Promise<IApiResponse<void>> => {
  const response = await fetch(`/api/community/posts/${postId}/like`, {
    method: 'POST',
  });
  return response.json();
};

export const createComment = async (data: {
  postId: string;
  content: string;
}): Promise<IApiResponse<void>> => {
  const response = await fetch('/api/community/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
