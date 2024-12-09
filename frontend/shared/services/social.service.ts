import { ApiService } from './api.service';
import { storage } from '../utils';

export class SocialService {
  private api: ApiService;

  constructor() {
    this.api = ApiService.getInstance();
  }

  /**
   * 发布帖子
   */
  async createPost(postData: {
    content: string;
    type: string;
    mediaUrls?: string[];
    healthData?: any;
    tags?: string[];
    location?: any;
    visibility?: string;
  }) {
    return this.api.post('/social/posts', postData);
  }

  /**
   * 关注用户
   */
  async followUser(userId: string) {
    return this.api.post(`/social/follow/${userId}`);
  }

  /**
   * 加入社区
   */
  async joinCommunity(communityId: string) {
    return this.api.post(`/social/communities/${communityId}/join`);
  }

  /**
   * 获取动态流
   */
  async getFeed(page: number = 1, limit: number = 20) {
    return this.api.get('/social/feed', {
      params: { page, limit }
    });
  }

  /**
   * 点赞帖子
   */
  async likePost(postId: string) {
    return this.api.post(`/social/posts/${postId}/like`);
  }

  /**
   * 评论帖子
   */
  async commentPost(postId: string, content: string) {
    return this.api.post(`/social/posts/${postId}/comments`, { content });
  }

  /**
   * 分享帖子
   */
  async sharePost(postId: string, content?: string) {
    return this.api.post(`/social/posts/${postId}/share`, { content });
  }

  /**
   * 获取社区列表
   */
  async getCommunities(params: {
    category?: string;
    query?: string;
    page?: number;
    limit?: number;
  }) {
    return this.api.get('/social/communities', { params });
  }

  /**
   * 获取社区详情
   */
  async getCommunityDetails(communityId: string) {
    return this.api.get(`/social/communities/${communityId}`);
  }

  /**
   * 发布社区帖子
   */
  async createCommunityPost(communityId: string, postData: any) {
    return this.api.post(`/social/communities/${communityId}/posts`, postData);
  }
} 