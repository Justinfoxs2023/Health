import { logger } from '../logger';

/** 帖子类型 */
export enum PostType {
  EXPERIENCE = 'experience', // 经验分享
  QUESTION = 'question', // 问题咨询
  ACHIEVEMENT = 'achievement', // 成就展示
  ACTIVITY = 'activity', // 活动组织
  ARTICLE = 'article' // 专业文章
}

/** 帖子标签 */
export enum PostTag {
  DIET = 'diet', // 饮食
  EXERCISE = 'exercise', // 运动
  HEALTH = 'health', // 健康
  MEDICAL = 'medical', // 医疗
  MENTAL = 'mental', // 心理
  LIFESTYLE = 'lifestyle' // 生活方式
}

/** 帖子内容 */
export interface Post {
  /** ID */
  id: string;
  /** 作者ID */
  authorId: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 类型 */
  type: PostType;
  /** 标签 */
  tags: PostTag[];
  /** 图片URL */
  images?: string[];
  /** 视频URL */
  video?: string;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
  /** 浏览数 */
  views: number;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/** 评论内容 */
export interface Comment {
  /** ID */
  id: string;
  /** 帖子ID */
  postId: string;
  /** 作者ID */
  authorId: string;
  /** 内容 */
  content: string;
  /** 回复评论ID */
  replyTo?: string;
  /** 点赞数 */
  likes: number;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/** 用户互动 */
export interface Interaction {
  /** 用户ID */
  userId: string;
  /** 帖子ID */
  postId?: string;
  /** 评论ID */
  commentId?: string;
  /** 互动类型 */
  type: 'like' | 'favorite' | 'share';
  /** 创建时间 */
  createdAt: Date;
}

/** 帖子查询选项 */
export interface PostQueryOptions {
  /** 类型 */
  type?: PostType;
  /** 标签 */
  tags?: PostTag[];
  /** 作者ID */
  authorId?: string;
  /** 排序方式 */
  sort?: 'latest' | 'popular' | 'recommended';
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 社区服务 */
export class CommunityService {
  private static instance: CommunityService;

  private constructor() {}

  /** 获取单例 */
  public static getInstance(): CommunityService {
    if (!CommunityService.instance) {
      CommunityService.instance = new CommunityService();
    }
    return CommunityService.instance;
  }

  /** 创建帖子 */
  public async createPost(
    authorId: string,
    data: {
      title: string;
      content: string;
      type: PostType;
      tags: PostTag[];
      images?: string[];
      video?: string;
    }
  ): Promise<Post> {
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorId,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to create post', { error });
      throw error;
    }
  }

  /** 获取帖子列表 */
  public async getPosts(options: PostQueryOptions = {}): Promise<{
    posts: Post[];
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (options.type) queryParams.append('type', options.type);
      if (options.tags) options.tags.forEach(tag => queryParams.append('tags', tag));
      if (options.authorId) queryParams.append('authorId', options.authorId);
      if (options.sort) queryParams.append('sort', options.sort);
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.pageSize) queryParams.append('pageSize', options.pageSize.toString());

      const response = await fetch(`/api/community/posts?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to fetch posts', { error });
      throw error;
    }
  }

  /** 获取帖子详情 */
  public async getPost(postId: string): Promise<Post> {
    try {
      const response = await fetch(`/api/community/posts/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to fetch post', { error });
      throw error;
    }
  }

  /** 更新帖子 */
  public async updatePost(
    postId: string,
    data: Partial<{
      title: string;
      content: string;
      type: PostType;
      tags: PostTag[];
      images: string[];
      video: string;
    }>
  ): Promise<Post> {
    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          updatedAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to update post', { error });
      throw error;
    }
  }

  /** 删除帖子 */
  public async deletePost(postId: string): Promise<void> {
    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      logger.error('Failed to delete post', { error });
      throw error;
    }
  }

  /** 创建评论 */
  public async createComment(
    authorId: string,
    data: {
      postId: string;
      content: string;
      replyTo?: string;
    }
  ): Promise<Comment> {
    try {
      const response = await fetch('/api/community/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorId,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to create comment', { error });
      throw error;
    }
  }

  /** 获取评论列表 */
  public async getComments(
    postId: string,
    options: {
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<{
    comments: Comment[];
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.pageSize) queryParams.append('pageSize', options.pageSize.toString());

      const response = await fetch(`/api/community/posts/${postId}/comments?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to fetch comments', { error });
      throw error;
    }
  }

  /** 更新评论 */
  public async updateComment(
    commentId: string,
    data: {
      content: string;
    }
  ): Promise<Comment> {
    try {
      const response = await fetch(`/api/community/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          updatedAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to update comment', { error });
      throw error;
    }
  }

  /** 删除评论 */
  public async deleteComment(commentId: string): Promise<void> {
    try {
      const response = await fetch(`/api/community/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      logger.error('Failed to delete comment', { error });
      throw error;
    }
  }

  /** 添加互动 */
  public async addInteraction(
    userId: string,
    data: {
      postId?: string;
      commentId?: string;
      type: 'like' | 'favorite' | 'share';
    }
  ): Promise<Interaction> {
    try {
      const response = await fetch('/api/community/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          ...data,
          createdAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add interaction');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to add interaction', { error });
      throw error;
    }
  }

  /** 删除互动 */
  public async removeInteraction(
    userId: string,
    data: {
      postId?: string;
      commentId?: string;
      type: 'like' | 'favorite' | 'share';
    }
  ): Promise<void> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      if (data.postId) queryParams.append('postId', data.postId);
      if (data.commentId) queryParams.append('commentId', data.commentId);
      queryParams.append('type', data.type);

      const response = await fetch(`/api/community/interactions?${queryParams}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to remove interaction');
      }
    } catch (error) {
      logger.error('Failed to remove interaction', { error });
      throw error;
    }
  }

  /** 获取用户互动列表 */
  public async getUserInteractions(
    userId: string,
    type: 'like' | 'favorite' | 'share'
  ): Promise<{
    posts: Post[];
    comments: Comment[];
  }> {
    try {
      const response = await fetch(`/api/community/users/${userId}/interactions/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user interactions');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to fetch user interactions', { error });
      throw error;
    }
  }

  /** 搜索帖子 */
  public async searchPosts(
    keyword: string,
    options: PostQueryOptions = {}
  ): Promise<{
    posts: Post[];
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('keyword', keyword);
      if (options.type) queryParams.append('type', options.type);
      if (options.tags) options.tags.forEach(tag => queryParams.append('tags', tag));
      if (options.sort) queryParams.append('sort', options.sort);
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.pageSize) queryParams.append('pageSize', options.pageSize.toString());

      const response = await fetch(`/api/community/search?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to search posts');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to search posts', { error });
      throw error;
    }
  }
}

export const communityService = CommunityService.getInstance(); 