import { CacheManager } from '../cache/CacheManager';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IContent {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: article  video  audio  question  answer  comment;
  title: string;
  content: string;
  authorId: string;
  status: draft  pending  published  archived  deleted;
  visibility: public  private  members;
  tags: string;
  category: string;
  metadata: {
    cover: string;
    summary: string;
    duration: number;
    attachments: Array{
      id: string;
      name: string;
      type: string;
      url: string;
      size: number;
    }>;
    [key: string]: any;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    collects: number;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface IComment {
  /** id 的描述 */
    id: string;
  /** contentId 的描述 */
    contentId: string;
  /** parentId 的描述 */
    parentId: string;
  /** authorId 的描述 */
    authorId: string;
  /** content 的描述 */
    content: string;
  /** status 的描述 */
    status: pending  approved  rejected  deleted;
  metadata: {
    attachments: Array{
      id: string;
      type: string;
      url: string;
    }>;
    [key: string]: any;
  };
  stats: {
    likes: number;
    replies: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IContentAudit {
  /** id 的描述 */
    id: string;
  /** contentId 的描述 */
    contentId: string;
  /** type 的描述 */
    type: content  /** comment 的描述 */
    /** comment 的描述 */
    comment;
  /** status 的描述 */
    status: pending  approved  rejected;
  reason: string;
  auditorId: string;
  metadata: Recordstring, any;
  createdAt: Date;
  updatedAt: Date;
}

@injectable()
export class ContentService {
  private contents: Map<string, IContent> = new Map();
  private comments: Map<string, IComment[]> = new Map();
  private audits: Map<string, IContentAudit[]> = new Map();

  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
    @inject() private cacheManager: CacheManager,
  ) {
    this.initializeData();
  }

  /**
   * 初始化数据
   */
  private async initializeData(): Promise<void> {
    try {
      const [cachedContents, cachedComments, cachedAudits] = await Promise.all([
        this.cacheManager.get('content:contents'),
        this.cacheManager.get('content:comments'),
        this.cacheManager.get('content:audits'),
      ]);

      if (cachedContents && cachedComments && cachedAudits) {
        this.contents = new Map(Object.entries(cachedContents));
        this.comments = new Map(Object.entries(cachedComments));
        this.audits = new Map(Object.entries(cachedAudits));
      } else {
        await Promise.all([
          this.loadContentsFromDB(),
          this.loadCommentsFromDB(),
          this.loadAuditsFromDB(),
        ]);
      }

      this.logger.info('内容服务数据初始化成功');
    } catch (error) {
      this.logger.error('内容服务数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 创建内容
   */
  public async createContent(authorId: string, data: Partial<IContent>): Promise<IContent> {
    try {
      const content: IContent = {
        id: Date.now().toString(),
        type: data.type || 'article',
        title: data.title || '',
        content: data.content || '',
        authorId,
        status: 'draft',
        visibility: data.visibility || 'public',
        tags: data.tags || [],
        category: data.category || 'general',
        metadata: data.metadata || {},
        stats: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          collects: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.saveContent(content);

      this.eventBus.publish('content.created', {
        contentId: content.id,
        authorId,
        type: content.type,
        timestamp: Date.now(),
      });

      return content;
    } catch (error) {
      this.logger.error('创建内容失败', error);
      throw error;
    }
  }

  /**
   * 更新内容
   */
  public async updateContent(
    contentId: string,
    authorId: string,
    data: Partial<IContent>,
  ): Promise<IContent> {
    try {
      const content = await this.getContent(contentId);
      if (!content) {
        throw new Error('内容不存在');
      }

      if (content.authorId !== authorId) {
        throw new Error('无权更新此内容');
      }

      const updatedContent: IContent = {
        ...content,
        ...data,
        updatedAt: new Date(),
      };

      await this.saveContent(updatedContent);

      this.eventBus.publish('content.updated', {
        contentId,
        authorId,
        type: content.type,
        timestamp: Date.now(),
      });

      return updatedContent;
    } catch (error) {
      this.logger.error('更新内容失败', error);
      throw error;
    }
  }

  /**
   * 发布内容
   */
  public async publishContent(contentId: string, authorId: string): Promise<IContent> {
    try {
      const content = await this.getContent(contentId);
      if (!content) {
        throw new Error('内容不存在');
      }

      if (content.authorId !== authorId) {
        throw new Error('无权发布此内容');
      }

      if (content.status !== 'draft') {
        throw new Error('只能发布草稿状态的内容');
      }

      content.status = 'pending';
      content.updatedAt = new Date();

      await this.saveContent(content);

      // 创建审核记录
      await this.createAudit({
        contentId,
        type: 'content',
        status: 'pending',
        auditorId: 'system',
        metadata: {},
      });

      this.eventBus.publish('content.published', {
        contentId,
        authorId,
        type: content.type,
        timestamp: Date.now(),
      });

      return content;
    } catch (error) {
      this.logger.error('发布内容失败', error);
      throw error;
    }
  }

  /**
   * 审核内容
   */
  public async auditContent(
    contentId: string,
    auditorId: string,
    status: 'approved' | 'rejected',
    reason?: string,
  ): Promise<IContent> {
    try {
      const content = await this.getContent(contentId);
      if (!content) {
        throw new Error('内容不存在');
      }

      if (content.status !== 'pending') {
        throw new Error('只能审核待审核���态的内容');
      }

      content.status = status === 'approved' ? 'published' : 'draft';
      content.updatedAt = new Date();
      if (status === 'approved') {
        content.publishedAt = new Date();
      }

      await this.saveContent(content);

      // 创建审核记录
      await this.createAudit({
        contentId,
        type: 'content',
        status,
        reason,
        auditorId,
        metadata: {},
      });

      this.eventBus.publish('content.audited', {
        contentId,
        auditorId,
        status,
        timestamp: Date.now(),
      });

      return content;
    } catch (error) {
      this.logger.error('审核内容失败', error);
      throw error;
    }
  }

  /**
   * 删除内容
   */
  public async deleteContent(contentId: string, authorId: string): Promise<void> {
    try {
      const content = await this.getContent(contentId);
      if (!content) {
        throw new Error('内容不存在');
      }

      if (content.authorId !== authorId) {
        throw new Error('无权删除此内容');
      }

      content.status = 'deleted';
      content.updatedAt = new Date();

      await this.saveContent(content);

      this.eventBus.publish('content.deleted', {
        contentId,
        authorId,
        type: content.type,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error('删除内容失败', error);
      throw error;
    }
  }

  /**
   * 添加评论
   */
  public async addComment(
    contentId: string,
    authorId: string,
    data: Partial<IComment>,
  ): Promise<IComment> {
    try {
      const content = await this.getContent(contentId);
      if (!content) {
        throw new Error('内容不存在');
      }

      const comment: IComment = {
        id: Date.now().toString(),
        contentId,
        parentId: data.parentId,
        authorId,
        content: data.content || '',
        status: 'pending',
        metadata: data.metadata || {},
        stats: {
          likes: 0,
          replies: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.saveComment(comment);

      // 更新内容评论数
      content.stats.comments++;
      await this.saveContent(content);

      // 如果是回复评论，更新父评论回复数
      if (comment.parentId) {
        const parentComment = await this.getComment(comment.parentId);
        if (parentComment) {
          parentComment.stats.replies++;
          await this.saveComment(parentComment);
        }
      }

      this.eventBus.publish('comment.created', {
        commentId: comment.id,
        contentId,
        authorId,
        timestamp: Date.now(),
      });

      return comment;
    } catch (error) {
      this.logger.error('添加评论失败', error);
      throw error;
    }
  }

  /**
   * 审核评论
   */
  public async auditComment(
    commentId: string,
    auditorId: string,
    status: 'approved' | 'rejected',
    reason?: string,
  ): Promise<IComment> {
    try {
      const comment = await this.getComment(commentId);
      if (!comment) {
        throw new Error('评论不存在');
      }

      if (comment.status !== 'pending') {
        throw new Error('只能审核待审核状态的评论');
      }

      comment.status = status;
      comment.updatedAt = new Date();

      await this.saveComment(comment);

      // 创建审核记录
      await this.createAudit({
        contentId: comment.id,
        type: 'comment',
        status,
        reason,
        auditorId,
        metadata: {},
      });

      this.eventBus.publish('comment.audited', {
        commentId,
        contentId: comment.contentId,
        auditorId,
        status,
        timestamp: Date.now(),
      });

      return comment;
    } catch (error) {
      this.logger.error('审核评论失败', error);
      throw error;
    }
  }

  /**
   * 删除评论
   */
  public async deleteComment(commentId: string, authorId: string): Promise<void> {
    try {
      const comment = await this.getComment(commentId);
      if (!comment) {
        throw new Error('评论不存在');
      }

      if (comment.authorId !== authorId) {
        throw new Error('无权删除此评论');
      }

      comment.status = 'deleted';
      comment.updatedAt = new Date();

      await this.saveComment(comment);

      // 更新内容评论数
      const content = await this.getContent(comment.contentId);
      if (content) {
        content.stats.comments--;
        await this.saveContent(content);
      }

      // 如果是回复评论，更新父评论回复数
      if (comment.parentId) {
        const parentComment = await this.getComment(comment.parentId);
        if (parentComment) {
          parentComment.stats.replies--;
          await this.saveComment(parentComment);
        }
      }

      this.eventBus.publish('comment.deleted', {
        commentId,
        contentId: comment.contentId,
        authorId,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error('删除评论失败', error);
      throw error;
    }
  }

  /**
   * 获取内容
   */
  public async getContent(contentId: string): Promise<IContent | null> {
    return this.contents.get(contentId) || null;
  }

  /**
   * 获取评论
   */
  public async getComment(commentId: string): Promise<IComment | null> {
    for (const comments of this.comments.values()) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        return comment;
      }
    }
    return null;
  }

  /**
   * 获取内容列表
   */
  public async getContents(
    filters?: {
      authorId?: string;
      type?: IContent['type'];
      status?: IContent['status'];
      visibility?: IContent['visibility'];
      category?: string;
      tags?: string[];
      startDate?: Date;
      endDate?: Date;
    },
    pagination?: {
      page: number;
      pageSize: number;
    },
  ): Promise<{
    items: IContent[];
    total: number;
  }> {
    let contents = Array.from(this.contents.values());

    // 应用过滤条件
    if (filters) {
      contents = contents.filter(content => {
        if (filters.authorId && content.authorId !== filters.authorId) {
          return false;
        }

        if (filters.type && content.type !== filters.type) {
          return false;
        }

        if (filters.status && content.status !== filters.status) {
          return false;
        }

        if (filters.visibility && content.visibility !== filters.visibility) {
          return false;
        }

        if (filters.category && content.category !== filters.category) {
          return false;
        }

        if (filters.tags && filters.tags.length > 0) {
          if (!filters.tags.some(tag => content.tags.includes(tag))) {
            return false;
          }
        }

        if (filters.startDate && content.createdAt < filters.startDate) {
          return false;
        }

        if (filters.endDate && content.createdAt > filters.endDate) {
          return false;
        }

        return true;
      });
    }

    // 计算总数
    const total = contents.length;

    // 应用分页
    if (pagination) {
      const { page, pageSize } = pagination;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      contents = contents.slice(start, end);
    }

    return {
      items: contents,
      total,
    };
  }

  /**
   * 获取评论列表
   */
  public async getComments(
    contentId: string,
    filters?: {
      parentId?: string;
      status?: IComment['status'];
      startDate?: Date;
      endDate?: Date;
    },
    pagination?: {
      page: number;
      pageSize: number;
    },
  ): Promise<{
    items: IComment[];
    total: number;
  }> {
    let comments = this.comments.get(contentId) || [];

    // 应用过滤条件
    if (filters) {
      comments = comments.filter(comment => {
        if (filters.parentId !== undefined) {
          if (filters.parentId === null && comment.parentId !== undefined) {
            return false;
          }
          if (filters.parentId !== null && comment.parentId !== filters.parentId) {
            return false;
          }
        }

        if (filters.status && comment.status !== filters.status) {
          return false;
        }

        if (filters.startDate && comment.createdAt < filters.startDate) {
          return false;
        }

        if (filters.endDate && comment.createdAt > filters.endDate) {
          return false;
        }

        return true;
      });
    }

    // 计算总数
    const total = comments.length;

    // 应用分页
    if (pagination) {
      const { page, pageSize } = pagination;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      comments = comments.slice(start, end);
    }

    return {
      items: comments,
      total,
    };
  }

  /**
   * 获取审核记录
   */
  public async getAudits(contentId: string, type: IContentAudit['type']): Promise<IContentAudit[]> {
    const audits = this.audits.get(contentId) || [];
    return audits.filter(audit => audit.type === type);
  }

  /**
   * 创建审核记录
   */
  private async createAudit(
    data: Omit<IContentAudit, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IContentAudit> {
    const audit: IContentAudit = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const contentAudits = this.audits.get(data.contentId) || [];
    contentAudits.push(audit);
    this.audits.set(data.contentId, contentAudits);

    return audit;
  }

  /**
   * 从数据库加载内容
   */
  private async loadContentsFromDB(): Promise<void> {
    // 实现从数据��加载内容的逻辑
  }

  /**
   * 从数据库加载评论
   */
  private async loadCommentsFromDB(): Promise<void> {
    // 实现从数据库加载评论的逻辑
  }

  /**
   * 从数据库加载审核记录
   */
  private async loadAuditsFromDB(): Promise<void> {
    // 实现从数据库加载审核记录的逻辑
  }

  /**
   * 保存内容
   */
  private async saveContent(content: IContent): Promise<void> {
    try {
      this.contents.set(content.id, content);
      // 保存到数据库
      this.logger.info(`保存内容: ${content.id}`);
    } catch (error) {
      this.logger.error('保存内容失败', error);
      throw error;
    }
  }

  /**
   * 保存评论
   */
  private async saveComment(comment: IComment): Promise<void> {
    try {
      const comments = this.comments.get(comment.contentId) || [];
      const index = comments.findIndex(c => c.id === comment.id);
      if (index >= 0) {
        comments[index] = comment;
      } else {
        comments.push(comment);
      }
      this.comments.set(comment.contentId, comments);
      // 保存到数据库
      this.logger.info(`保存评论: ${comment.id}`);
    } catch (error) {
      this.logger.error('保存评论失败', error);
      throw error;
    }
  }
}
