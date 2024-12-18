import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { StorageService } from '../storage/StorageService';

@Injectable()
export class ContentService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
    private readonly storageService: StorageService,
  ) {}

  async createContent(expertId: string, contentData: any): Promise<any> {
    try {
      // 验证内容数据
      this.validateContentData(contentData);

      // 检查专家资质
      await this.checkExpertQualification(expertId);

      // 处理内容图片
      const images = await Promise.all(
        (contentData.images || []).map(image => this.storageService.uploadFile('content', image)),
      );

      // 创建内容
      const content = await this.databaseService.create('contents', {
        expertId,
        ...contentData,
        images,
        status: 'draft',
        views: 0,
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 发送事件
      await this.eventBus.emit('content.created', { content });

      return content;
    } catch (error) {
      this.logger.error('创建内容失败', error);
      throw error;
    }
  }

  async updateContent(contentId: string, expertId: string, updateData: any): Promise<any> {
    try {
      // 获取内容信息
      const content = await this.databaseService.findOne('contents', { _id: contentId });
      if (!content) {
        throw new Error('内容不存在');
      }

      if (content.expertId !== expertId) {
        throw new Error('无权操作此内容');
      }

      // 处理新图片
      let images = content.images;
      if (updateData.images) {
        images = await Promise.all(
          updateData.images.map(image => this.storageService.uploadFile('content', image)),
        );
      }

      // 更新内容
      const updatedContent = await this.databaseService.update(
        'contents',
        { _id: contentId },
        {
          ...updateData,
          images,
          updatedAt: new Date(),
        },
      );

      // 清除缓存
      await this.clearContentCache(contentId);

      // 发送事件
      await this.eventBus.emit('content.updated', { content: updatedContent });

      return updatedContent;
    } catch (error) {
      this.logger.error('更新内容失败', error);
      throw error;
    }
  }

  async publishContent(contentId: string, expertId: string): Promise<any> {
    try {
      // 获取内容信息
      const content = await this.databaseService.findOne('contents', { _id: contentId });
      if (!content) {
        throw new Error('内容不存在');
      }

      if (content.expertId !== expertId) {
        throw new Error('无权操作此内容');
      }

      if (content.status !== 'draft') {
        throw new Error('内容状态错误');
      }

      // 更新内容状态
      const publishedContent = await this.databaseService.update(
        'contents',
        { _id: contentId },
        {
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      );

      // 清除缓存
      await this.clearContentCache(contentId);

      // 发送事件
      await this.eventBus.emit('content.published', { content: publishedContent });

      return publishedContent;
    } catch (error) {
      this.logger.error('发布内容失败', error);
      throw error;
    }
  }

  async getContent(contentId: string): Promise<any> {
    try {
      // 尝试从缓存获取
      const cacheKey = `content:${contentId}`;
      let content = await this.cacheService.get(cacheKey);

      if (!content) {
        // 从数据库获取
        content = await this.databaseService.findOne('contents', { _id: contentId });
        if (!content) {
          throw new Error('内容不存在');
        }

        // 设置缓存
        await this.cacheService.set(cacheKey, content, 3600);
      }

      // 更新浏览量
      await this.databaseService.update('contents', { _id: contentId }, { $inc: { views: 1 } });

      return content;
    } catch (error) {
      this.logger.error('获取内容失败', error);
      throw error;
    }
  }

  async listContents(query: {
    category?: string;
    expertId?: string;
    status?: string;
    keyword?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    total: number;
    contents: any[];
  }> {
    try {
      const { category, expertId, status, keyword, page = 1, limit = 20 } = query;
      const conditions: any = {};

      if (category) {
        conditions.category = category;
      }

      if (expertId) {
        conditions.expertId = expertId;
      }

      if (status) {
        conditions.status = status;
      }

      if (keyword) {
        conditions.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;
      const [total, contents] = await Promise.all([
        this.databaseService.count('contents', conditions),
        this.databaseService.find('contents', conditions, { skip, limit, sort: { createdAt: -1 } }),
      ]);

      return { total, contents };
    } catch (error) {
      this.logger.error('获取内容列表失败', error);
      throw error;
    }
  }

  async likeContent(contentId: string, userId: string): Promise<void> {
    try {
      // 检查是否已点赞
      const existingLike = await this.databaseService.findOne('content_likes', {
        contentId,
        userId,
      });

      if (existingLike) {
        throw new Error('已点赞此内容');
      }

      // 创建点赞记录
      await this.databaseService.create('content_likes', {
        contentId,
        userId,
        createdAt: new Date(),
      });

      // 更新点赞数
      await this.databaseService.update('contents', { _id: contentId }, { $inc: { likes: 1 } });

      // 清除缓存
      await this.clearContentCache(contentId);

      // 发送事件
      await this.eventBus.emit('content.liked', { contentId, userId });
    } catch (error) {
      this.logger.error('点赞内容失败', error);
      throw error;
    }
  }

  async commentContent(contentId: string, userId: string, comment: string): Promise<any> {
    try {
      // 创建评论
      const commentDoc = await this.databaseService.create('content_comments', {
        contentId,
        userId,
        comment,
        createdAt: new Date(),
      });

      // 更新评论数
      await this.databaseService.update('contents', { _id: contentId }, { $inc: { comments: 1 } });

      // 清除缓存
      await this.clearContentCache(contentId);

      // 发送事件
      await this.eventBus.emit('content.commented', { contentId, userId, comment: commentDoc });

      return commentDoc;
    } catch (error) {
      this.logger.error('评论内容失败', error);
      throw error;
    }
  }

  private validateContentData(data: any): void {
    if (!data.title || !data.content || !data.category) {
      throw new Error('内容数据不完整');
    }
  }

  private async checkExpertQualification(expertId: string): Promise<void> {
    const expert = await this.databaseService.findOne('experts', { userId: expertId });
    if (!expert) {
      throw new Error('专家不存在');
    }

    if (expert.status !== 'active') {
      throw new Error('专家资质未通过审核');
    }
  }

  private async clearContentCache(contentId: string): Promise<void> {
    await this.cacheService.del(`content:${contentId}`);
  }
}
