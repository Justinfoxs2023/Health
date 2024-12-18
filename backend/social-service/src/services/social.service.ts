import { Logger } from '../utils/logger';
import { NotificationService } from './notification.service';
import { Post, Relationship, Community } from '../models/social.model';
import { Redis } from '../utils/redis';

export class SocialService {
  private redis: Redis;
  private logger: Logger;
  private notificationService: NotificationService;

  constructor() {
    this.redis = new Redis();
    this.logger = new Logger('SocialService');
    this.notificationService = new NotificationService();
  }

  /**
   * 创建帖子
   */
  async createPost(
    userId: string,
    postData: {
      content: string;
      type: string;
      mediaUrls?: string[];
      healthData?: any;
      tags?: string[];
      location?: any;
      visibility?: string;
    },
  ) {
    try {
      const post = new Post({
        userId,
        ...postData,
      });

      await post.save();

      // 更新用户动态缓存
      await this.updateUserFeed(userId, post);

      // 通知关注者
      if (post.visibility === 'public') {
        await this.notifyFollowers(userId, 'new_post', post);
      }

      return post;
    } catch (error) {
      this.logger.error('创建帖子失败', error);
      throw error;
    }
  }

  /**
   * 关注用户
   */
  async followUser(followerId: string, followingId: string) {
    try {
      const relationship = await Relationship.findOneAndUpdate(
        { followerId, followingId },
        { status: 'accepted' },
        { upsert: true, new: true },
      );

      // 通知被关注用户
      await this.notificationService.sendNotification(followingId, {
        type: 'new_follower',
        data: { userId: followerId },
      });

      // 更新关注者缓存
      await this.updateFollowersCache(followingId);

      return relationship;
    } catch (error) {
      this.logger.error('关注用户失败', error);
      throw error;
    }
  }

  /**
   * 创建社区
   */
  async createCommunity(
    userId: string,
    communityData: {
      name: string;
      description: string;
      category: string;
      avatar?: string;
      cover?: string;
      rules?: string[];
      isPrivate?: boolean;
    },
  ) {
    try {
      const community = new Community({
        ...communityData,
        creator: userId,
        admins: [userId],
        members: [
          {
            userId,
            role: 'admin',
            joinedAt: new Date(),
          },
        ],
        memberCount: 1,
      });

      await community.save();

      // 更新社区缓存
      await this.updateCommunityCache(community._id);

      return community;
    } catch (error) {
      this.logger.error('创建社区失败', error);
      throw error;
    }
  }

  /**
   * 获取用户动态流
   */
  async getUserFeed(userId: string, page = 1, limit = 20) {
    try {
      const following = await Relationship.find({
        followerId: userId,
        status: 'accepted',
      }).select('followingId');

      const followingIds = following.map(f => f.followingId);

      const posts = await Post.find({
        $or: [{ userId: { $in: followingIds }, visibility: 'public' }, { userId }],
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'username avatar');

      return posts;
    } catch (error) {
      this.logger.error('获取用户动态失败', error);
      throw error;
    }
  }

  /**
   * 更新用户动态缓存
   */
  private async updateUserFeed(userId: string, post: any) {
    const cacheKey = `feed:${userId}`;
    await this.redis.lpush(cacheKey, JSON.stringify(post));
    await this.redis.ltrim(cacheKey, 0, 99); // 保留最近100条
  }

  /**
   * 通知关注者
   */
  private async notifyFollowers(userId: string, type: string, data: any) {
    const followers = await Relationship.find({
      followingId: userId,
      status: 'accepted',
    });

    for (const follower of followers) {
      await this.notificationService.sendNotification(follower.followerId, {
        type,
        data,
      });
    }
  }

  /**
   * 更新关注者缓存
   */
  private async updateFollowersCache(userId: string) {
    const followers = await Relationship.find({
      followingId: userId,
      status: 'accepted',
    });

    await this.redis.setex(`followers:${userId}`, 3600, JSON.stringify(followers));
  }

  /**
   * 更新社区缓存
   */
  private async updateCommunityCache(communityId: string) {
    const community = await Community.findById(communityId);
    await this.redis.setex(`community:${communityId}`, 3600, JSON.stringify(community));
  }
}
