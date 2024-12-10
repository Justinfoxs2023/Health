import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRelation, IUserRelation } from '../schemas/UserRelation';
import { Favorite, IFavorite } from '../schemas/Favorite';
import { Timeline, ITimeline } from '../schemas/Timeline';
import { CacheService } from './CacheService';

@Injectable()
export class UserInteractionService {
  constructor(
    @InjectModel(UserRelation.name) private userRelationModel: Model<IUserRelation>,
    @InjectModel(Favorite.name) private favoriteModel: Model<IFavorite>,
    @InjectModel(Timeline.name) private timelineModel: Model<ITimeline>,
    private cacheService: CacheService
  ) {}

  // 关注用户
  async followUser(followerId: string, followingId: string): Promise<IUserRelation> {
    const relation = await this.userRelationModel.create({
      follower: followerId,
      following: followingId
    });

    // 更新缓存
    await this.cacheService.invalidateUserCache(followerId);
    await this.cacheService.invalidateUserCache(followingId);

    // 创建时间线记录
    await this.timelineModel.create({
      userId: followerId,
      activityType: 'follow',
      contentType: 'User',
      contentId: followingId
    });

    return relation;
  }

  // 取消关注
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await this.userRelationModel.deleteOne({
      follower: followerId,
      following: followingId
    });

    // 更新缓存
    await this.cacheService.invalidateUserCache(followerId);
    await this.cacheService.invalidateUserCache(followingId);
  }

  // 获取关注列表
  async getFollowings(userId: string, page = 1, limit = 20) {
    const cacheKey = `user:${userId}:followings:${page}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const skip = (page - 1) * limit;
    const followings = await this.userRelationModel
      .find({ follower: userId, status: 'active' })
      .populate('following', 'username avatar bio')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    await this.cacheService.set(cacheKey, JSON.stringify(followings), 3600);
    return followings;
  }

  // 获取粉丝列表
  async getFollowers(userId: string, page = 1, limit = 20) {
    const cacheKey = `user:${userId}:followers:${page}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const skip = (page - 1) * limit;
    const followers = await this.userRelationModel
      .find({ following: userId, status: 'active' })
      .populate('follower', 'username avatar bio')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    await this.cacheService.set(cacheKey, JSON.stringify(followers), 3600);
    return followers;
  }

  // 添加收藏
  async addFavorite(userId: string, data: Partial<IFavorite>): Promise<IFavorite> {
    const favorite = await this.favoriteModel.create({
      userId,
      ...data
    });

    // 创建时间线记录
    await this.timelineModel.create({
      userId,
      activityType: 'favorite',
      contentType: data.contentType,
      contentId: data.contentId
    });

    return favorite;
  }

  // 取消收藏
  async removeFavorite(userId: string, favoriteId: string): Promise<void> {
    await this.favoriteModel.deleteOne({
      _id: favoriteId,
      userId
    });
  }

  // 获取用户收藏列表
  async getFavorites(userId: string, folder?: string, page = 1, limit = 20) {
    const query = { userId };
    if (folder) {
      query['folder'] = folder;
    }

    const skip = (page - 1) * limit;
    return this.favoriteModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('contentId');
  }

  // 获取用户动态时间线
  async getTimeline(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.timelineModel
      .find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('content');
  }

  // 检查是否已关注
  async checkFollowStatus(followerId: string, followingId: string): Promise<boolean> {
    const relation = await this.userRelationModel.findOne({
      follower: followerId,
      following: followingId,
      status: 'active'
    });
    return !!relation;
  }

  // 获取互动统计
  async getInteractionStats(userId: string) {
    const cacheKey = `user:${userId}:interaction-stats`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const [followersCount, followingCount, favoritesCount] = await Promise.all([
      this.userRelationModel.countDocuments({ following: userId, status: 'active' }),
      this.userRelationModel.countDocuments({ follower: userId, status: 'active' }),
      this.favoriteModel.countDocuments({ userId })
    ]);

    const stats = {
      followersCount,
      followingCount,
      favoritesCount
    };

    await this.cacheService.set(cacheKey, JSON.stringify(stats), 3600);
    return stats;
  }
} 