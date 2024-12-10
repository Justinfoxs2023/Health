import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, IActivity } from '../schemas/Activity';
import { CacheService } from './CacheService';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<IActivity>,
    private cacheService: CacheService
  ) {}

  // 创建活动
  async createActivity(data: Partial<IActivity>): Promise<IActivity> {
    const activity = await this.activityModel.create(data);
    await this.cacheService.invalidatePattern('activities:*');
    return activity;
  }

  // 更新活动
  async updateActivity(id: string, data: Partial<IActivity>): Promise<IActivity> {
    const activity = await this.activityModel.findByIdAndUpdate(id, data, { new: true });
    await this.cacheService.invalidatePattern('activities:*');
    return activity;
  }

  // 获取活动详情
  async getActivity(id: string): Promise<IActivity> {
    const cacheKey = `activity:${id}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const activity = await this.activityModel.findById(id);
    await this.cacheService.set(cacheKey, JSON.stringify(activity), 3600);
    return activity;
  }

  // 获取活动列表
  async getActivities(query: any = {}, page = 1, limit = 20) {
    const cacheKey = `activities:${JSON.stringify(query)}:${page}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const skip = (page - 1) * limit;
    const [activities, total] = await Promise.all([
      this.activityModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.activityModel.countDocuments(query)
    ]);

    const result = {
      activities,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };

    await this.cacheService.set(cacheKey, JSON.stringify(result), 3600);
    return result;
  }

  // 参加活动
  async joinActivity(activityId: string, userId: string): Promise<void> {
    const activity = await this.activityModel.findById(activityId);
    
    if (!activity) {
      throw new Error('Activity not found');
    }

    if (activity.currentParticipants >= activity.participantLimit) {
      throw new Error('Activity is full');
    }

    await this.activityModel.findByIdAndUpdate(activityId, {
      $inc: { currentParticipants: 1 }
    });

    // 更新缓存
    await this.cacheService.invalidatePattern(`activity:${activityId}`);
    await this.cacheService.invalidatePattern('activities:*');
  }

  // 更新活动进度
  async updateProgress(activityId: string, userId: string, progress: any): Promise<void> {
    // 实现活动进度更新逻辑
    // TODO: 根据具体需求实现
  }

  // 获取活动排行榜
  async getLeaderboard(activityId: string, metric: string = 'points') {
    const cacheKey = `activity:${activityId}:leaderboard:${metric}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // 实现排行榜查询逻辑
    // TODO: 根据具体需求实现
    const leaderboard = [];

    await this.cacheService.set(cacheKey, JSON.stringify(leaderboard), 3600);
    return leaderboard;
  }

  // 获取用户活动统计
  async getUserActivityStats(userId: string) {
    const cacheKey = `user:${userId}:activity-stats`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // 实现用户活动统计逻辑
    // TODO: 根据具体需求实现
    const stats = {
      totalParticipated: 0,
      completedActivities: 0,
      totalPoints: 0,
      achievements: []
    };

    await this.cacheService.set(cacheKey, JSON.stringify(stats), 3600);
    return stats;
  }
} 