import { ContentService } from '../content/content.service';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { Model } from 'mongoose';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';

@Injectable()
export class TCMCommunityService {
  private readonly logger = new Logger(TCMCommunityService.name);

  constructor(
    @InjectModel()
    private readonly tcmCommunityModel: Model<any>,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly contentService: ContentService,
  ) {}

  // 创建养生经验分享
  async createExperienceShare(
    userId: string,
    data: {
      title: string;
      content: string;
      tags: string[];
      images?: string[];
      constitution: string;
      category: string;
    },
  ): Promise<any> {
    try {
      const user = await this.userService.getUserProfile(userId);

      const share = await this.tcmCommunityModel.create({
        userId,
        userName: user.name,
        userAvatar: user.avatar,
        ...data,
        likes: 0,
        comments: [],
        createdAt: new Date(),
      });

      // 通知关注者
      await this.notifyFollowers(userId, 'experience_share', share._id);

      return share;
    } catch (error) {
      this.logger.error('创建养生经验分享失败', error);
      throw error;
    }
  }

  // 发布养生问答
  async createHealthQuestion(
    userId: string,
    data: {
      title: string;
      content: string;
      tags: string[];
      images?: string[];
      category: string;
    },
  ): Promise<any> {
    try {
      const user = await this.userService.getUserProfile(userId);

      const question = await this.tcmCommunityModel.create({
        type: 'question',
        userId,
        userName: user.name,
        userAvatar: user.avatar,
        ...data,
        answers: [],
        views: 0,
        createdAt: new Date(),
      });

      // 通知相关专家
      await this.notifyExperts(question);

      return question;
    } catch (error) {
      this.logger.error('发布养生问答失败', error);
      throw error;
    }
  }

  // 回答养生问题
  async createAnswer(
    userId: string,
    questionId: string,
    data: {
      content: string;
      images?: string[];
      references?: string[];
    },
  ): Promise<any> {
    try {
      const user = await this.userService.getUserProfile(userId);

      const answer = {
        userId,
        userName: user.name,
        userAvatar: user.avatar,
        ...data,
        likes: 0,
        comments: [],
        createdAt: new Date(),
      };

      const question = await this.tcmCommunityModel.findByIdAndUpdate(
        questionId,
        { $push: { answers: answer } },
        { new: true },
      );

      // 通知提问者
      await this.notifyQuestionAuthor(question.userId, questionId);

      return question;
    } catch (error) {
      this.logger.error('回答养生问题失败', error);
      throw error;
    }
  }

  // 创建养生小组
  async createHealthGroup(
    userId: string,
    data: {
      name: string;
      description: string;
      category: string;
      tags: string[];
      avatar?: string;
      isPrivate: boolean;
    },
  ): Promise<any> {
    try {
      const user = await this.userService.getUserProfile(userId);

      const group = await this.tcmCommunityModel.create({
        type: 'group',
        creator: {
          id: userId,
          name: user.name,
          avatar: user.avatar,
        },
        ...data,
        members: [userId],
        posts: [],
        createdAt: new Date(),
      });

      return group;
    } catch (error) {
      this.logger.error('创建养生小组失败', error);
      throw error;
    }
  }

  // 发布小组动态
  async createGroupPost(
    userId: string,
    groupId: string,
    data: {
      content: string;
      images?: string[];
      tags?: string[];
    },
  ): Promise<any> {
    try {
      const user = await this.userService.getUserProfile(userId);

      const post = {
        userId,
        userName: user.name,
        userAvatar: user.avatar,
        ...data,
        likes: 0,
        comments: [],
        createdAt: new Date(),
      };

      const group = await this.tcmCommunityModel.findByIdAndUpdate(
        groupId,
        { $push: { posts: post } },
        { new: true },
      );

      // 通知群组成员
      await this.notifyGroupMembers(groupId, 'new_post', post);

      return group;
    } catch (error) {
      this.logger.error('发布小组动态失败', error);
      throw error;
    }
  }

  // 获取养生经验列表
  async getExperienceShares(query: {
    category?: string;
    constitution?: string;
    tags?: string[];
    page: number;
    limit: number;
  }): Promise<{
    total: number;
    items: any[];
  }> {
    try {
      const filter = {
        type: 'experience',
        ...(query.category && { category: query.category }),
        ...(query.constitution && { constitution: query.constitution }),
        ...(query.tags?.length && { tags: { $in: query.tags } }),
      };

      const total = await this.tcmCommunityModel.countDocuments(filter);
      const items = await this.tcmCommunityModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit);

      return { total, items };
    } catch (error) {
      this.logger.error('获取养生经验列表失败', error);
      throw error;
    }
  }

  // 获取养生问答列表
  async getHealthQuestions(query: {
    category?: string;
    tags?: string[];
    status?: string;
    page: number;
    limit: number;
  }): Promise<{
    total: number;
    items: any[];
  }> {
    try {
      const filter = {
        type: 'question',
        ...(query.category && { category: query.category }),
        ...(query.tags?.length && { tags: { $in: query.tags } }),
        ...(query.status && { status: query.status }),
      };

      const total = await this.tcmCommunityModel.countDocuments(filter);
      const items = await this.tcmCommunityModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit);

      return { total, items };
    } catch (error) {
      this.logger.error('获取养生问答列表失败', error);
      throw error;
    }
  }

  // 获取养生小组列表
  async getHealthGroups(query: {
    category?: string;
    tags?: string[];
    page: number;
    limit: number;
  }): Promise<{
    total: number;
    items: any[];
  }> {
    try {
      const filter = {
        type: 'group',
        ...(query.category && { category: query.category }),
        ...(query.tags?.length && { tags: { $in: query.tags } }),
      };

      const total = await this.tcmCommunityModel.countDocuments(filter);
      const items = await this.tcmCommunityModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit);

      return { total, items };
    } catch (error) {
      this.logger.error('获取养生小组列表失败', error);
      throw error;
    }
  }

  // 点赞内容
  async likeContent(userId: string, contentId: string, contentType: string): Promise<void> {
    try {
      const update = { $addToSet: { likes: userId } };

      if (contentType === 'answer') {
        await this.tcmCommunityModel.updateOne(
          { 'answers._id': contentId },
          { $addToSet: { 'answers.$.likes': userId } },
        );
      } else if (contentType === 'comment') {
        await this.tcmCommunityModel.updateOne(
          { 'comments._id': contentId },
          { $addToSet: { 'comments.$.likes': userId } },
        );
      } else {
        await this.tcmCommunityModel.findByIdAndUpdate(contentId, update);
      }

      // 通知内容作者
      await this.notifyContentAuthor(contentId, userId, 'like');
    } catch (error) {
      this.logger.error('点赞内容失败', error);
      throw error;
    }
  }

  // 评论内容
  async commentContent(
    userId: string,
    contentId: string,
    data: {
      content: string;
      images?: string[];
      replyTo?: string;
    },
  ): Promise<any> {
    try {
      const user = await this.userService.getUserProfile(userId);

      const comment = {
        userId,
        userName: user.name,
        userAvatar: user.avatar,
        ...data,
        likes: 0,
        createdAt: new Date(),
      };

      const content = await this.tcmCommunityModel.findByIdAndUpdate(
        contentId,
        { $push: { comments: comment } },
        { new: true },
      );

      // 通知内容作者和被回复者
      await this.notifyCommentParticipants(content, comment);

      return content;
    } catch (error) {
      this.logger.error('评论内容失败', error);
      throw error;
    }
  }

  // 私有辅助方法
  private async notifyFollowers(userId: string, action: string, contentId: string): Promise<void> {
    const followers = await this.userService.getUserFollowers(userId);

    for (const follower of followers) {
      await this.notificationService.create({
        userId: follower.id,
        type: 'social',
        action,
        contentId,
        createdAt: new Date(),
      });
    }
  }

  private async notifyExperts(question: any): Promise<void> {
    const experts = await this.userService.getExpertsByTags(question.tags);

    for (const expert of experts) {
      await this.notificationService.create({
        userId: expert.id,
        type: 'question',
        action: 'new_question',
        contentId: question._id,
        createdAt: new Date(),
      });
    }
  }

  private async notifyQuestionAuthor(authorId: string, questionId: string): Promise<void> {
    await this.notificationService.create({
      userId: authorId,
      type: 'question',
      action: 'new_answer',
      contentId: questionId,
      createdAt: new Date(),
    });
  }

  private async notifyGroupMembers(groupId: string, action: string, content: any): Promise<void> {
    const group = await this.tcmCommunityModel.findById(groupId);

    for (const memberId of group.members) {
      if (memberId !== content.userId) {
        await this.notificationService.create({
          userId: memberId,
          type: 'group',
          action,
          contentId: group._id,
          createdAt: new Date(),
        });
      }
    }
  }

  private async notifyContentAuthor(
    contentId: string,
    actorId: string,
    action: string,
  ): Promise<void> {
    const content = await this.tcmCommunityModel.findById(contentId);

    if (content.userId !== actorId) {
      await this.notificationService.create({
        userId: content.userId,
        type: 'social',
        action,
        contentId,
        createdAt: new Date(),
      });
    }
  }

  private async notifyCommentParticipants(content: any, comment: any): Promise<void> {
    // 通知内容作者
    if (content.userId !== comment.userId) {
      await this.notificationService.create({
        userId: content.userId,
        type: 'social',
        action: 'comment',
        contentId: content._id,
        createdAt: new Date(),
      });
    }

    // 通知被回复者
    if (comment.replyTo) {
      const replyToComment = content.comments.find(c => c._id.toString() === comment.replyTo);

      if (replyToComment && replyToComment.userId !== comment.userId) {
        await this.notificationService.create({
          userId: replyToComment.userId,
          type: 'social',
          action: 'reply',
          contentId: content._id,
          createdAt: new Date(),
        });
      }
    }
  }
}
