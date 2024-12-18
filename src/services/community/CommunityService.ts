import { CacheManager } from '../cache/CacheManager';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IUser {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** avatar 的描述 */
    avatar: string;
  /** role 的描述 */
    role: user  expert  admin;
  expertise: string;
  title: string;
  organization: string;
  badges: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
}

export interface IPost {
  /** id 的描述 */
    id: string;
  /** authorId 的描述 */
    authorId: string;
  /** type 的描述 */
    type: article  question  experience  tip;
  title: string;
  content: string;
  tags: string;
  attachments: Array{
    type: image  video  document;
    url: string;
    name: string;
  }>;
  visibility: 'public' | 'followers' | 'private';
  status: 'draft' | 'published' | 'archived';
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    location?: string;
    device?: string;
    source?: string;
  };
}

export interface IComment {
  /** id 的描述 */
    id: string;
  /** postId 的描述 */
    postId: string;
  /** authorId 的描述 */
    authorId: string;
  /** content 的描述 */
    content: string;
  /** attachments 的描述 */
    attachments: Array{
    type: image;
    url: string;
  }>;
  replyTo?: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpertGroup {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** category 的描述 */
    category: string;
  /** experts 的描述 */
    experts: string;
  /** topics 的描述 */
    topics: string;
  /** rules 的描述 */
    rules: string;
  /** stats 的描述 */
    stats: {
    members: number;
    posts: number;
    activeUsers: number;
  };
  /** status 的描述 */
    status: "active" | "closed";
  /** createdAt 的描述 */
    createdAt: Date;
  /** updatedAt 的描述 */
    updatedAt: Date;
}

@injectable()
export class CommunityService {
  private users: Map<string, IUser> = new Map();
  private posts: Map<string, IPost> = new Map();
  private comments: Map<string, IComment[]> = new Map();
  private expertGroups: Map<string, IExpertGroup> = new Map();

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
      const [cachedUsers, cachedPosts, cachedComments, cachedGroups] = await Promise.all([
        this.cacheManager.get('community:users'),
        this.cacheManager.get('community:posts'),
        this.cacheManager.get('community:comments'),
        this.cacheManager.get('community:groups'),
      ]);

      if (cachedUsers && cachedPosts && cachedComments && cachedGroups) {
        this.users = new Map(Object.entries(cachedUsers));
        this.posts = new Map(Object.entries(cachedPosts));
        this.comments = new Map(Object.entries(cachedComments));
        this.expertGroups = new Map(Object.entries(cachedGroups));
      } else {
        await Promise.all([
          this.loadUsersFromDB(),
          this.loadPostsFromDB(),
          this.loadCommentsFromDB(),
          this.loadGroupsFromDB(),
        ]);
      }

      this.logger.info('社区数据初始化成功');
    } catch (error) {
      this.logger.error('社区数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 创建帖子
   */
  public async createPost(
    authorId: string,
    post: Omit<IPost, 'id' | 'authorId' | 'stats' | 'createdAt' | 'updatedAt'>,
  ): Promise<IPost> {
    try {
      const author = this.users.get(authorId);
      if (!author) {
        throw new Error(`用户不存在: ${authorId}`);
      }

      const newPost: IPost = {
        id: Date.now().toString(),
        authorId,
        ...post,
        stats: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 保存帖子
      await this.savePost(newPost);

      // 更新用户统计
      author.stats.posts++;
      await this.saveUser(author);

      // 发布事件
      this.eventBus.publish('community.post.created', {
        postId: newPost.id,
        authorId,
        timestamp: Date.now(),
      });

      return newPost;
    } catch (error) {
      this.logger.error('创建帖子失败', error);
      throw error;
    }
  }

  /**
   * 评论帖子
   */
  public async commentPost(
    postId: string,
    authorId: string,
    content: string,
    attachments?: IComment['attachments'],
    replyTo?: string,
  ): Promise<IComment> {
    try {
      const post = this.posts.get(postId);
      if (!post) {
        throw new Error(`帖子不存在: ${postId}`);
      }

      const author = this.users.get(authorId);
      if (!author) {
        throw new Error(`用户不存在: ${authorId}`);
      }

      const comment: IComment = {
        id: Date.now().toString(),
        postId,
        authorId,
        content,
        attachments,
        replyTo,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 保存评论
      const postComments = this.comments.get(postId) || [];
      postComments.push(comment);
      this.comments.set(postId, postComments);

      // 更新帖子统计
      post.stats.comments++;
      await this.savePost(post);

      // 发布事件
      this.eventBus.publish('community.comment.created', {
        commentId: comment.id,
        postId,
        authorId,
        timestamp: Date.now(),
      });

      return comment;
    } catch (error) {
      this.logger.error('评论帖子失败', error);
      throw error;
    }
  }

  /**
   * 点赞帖子
   */
  public async likePost(postId: string, userId: string): Promise<void> {
    try {
      const post = this.posts.get(postId);
      if (!post) {
        throw new Error(`帖子不存在: ${postId}`);
      }

      const user = this.users.get(userId);
      if (!user) {
        throw new Error(`用户不存在: ${userId}`);
      }

      // 更新帖子统计
      post.stats.likes++;
      await this.savePost(post);

      // 更新作者统计
      const author = this.users.get(post.authorId);
      if (author) {
        author.stats.likes++;
        await this.saveUser(author);
      }

      // 发布事件
      this.eventBus.publish('community.post.liked', {
        postId,
        userId,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error('点赞帖子失败', error);
      throw error;
    }
  }

  /**
   * 创建专家群组
   */
  public async createExpertGroup(
    group: Omit<IExpertGroup, 'id' | 'stats' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<IExpertGroup> {
    try {
      // 验证专家存在
      for (const expertId of group.experts) {
        const expert = this.users.get(expertId);
        if (!expert || expert.role !== 'expert') {
          throw new Error(`专家不存在或角色无效: ${expertId}`);
        }
      }

      const newGroup: IExpertGroup = {
        id: Date.now().toString(),
        ...group,
        stats: {
          members: group.experts.length,
          posts: 0,
          activeUsers: 0,
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 保存群组
      await this.saveExpertGroup(newGroup);

      // 发布事件
      this.eventBus.publish('community.group.created', {
        groupId: newGroup.id,
        timestamp: Date.now(),
      });

      return newGroup;
    } catch (error) {
      this.logger.error('创建专家群组失败', error);
      throw error;
    }
  }

  /**
   * 搜索帖子
   */
  public searchPosts(query: {
    keyword?: string;
    tags?: string[];
    type?: IPost['type'];
    authorId?: string;
    timeRange?: {
      start: Date;
      end: Date;
    };
  }): IPost[] {
    return Array.from(this.posts.values())
      .filter(post => {
        if (query.keyword) {
          const keyword = query.keyword.toLowerCase();
          return (
            post.title.toLowerCase().includes(keyword) ||
            post.content.toLowerCase().includes(keyword)
          );
        }

        if (query.tags) {
          return query.tags.some(tag => post.tags.includes(tag));
        }

        if (query.type && post.type !== query.type) {
          return false;
        }

        if (query.authorId && post.authorId !== query.authorId) {
          return false;
        }

        if (query.timeRange) {
          return post.createdAt >= query.timeRange.start && post.createdAt <= query.timeRange.end;
        }

        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * 获取专家推荐
   */
  public getExpertRecommendations(topics: string[], limit = 5): IUser[] {
    return Array.from(this.users.values())
      .filter(user => user.role === 'expert' && user.expertise?.some(exp => topics.includes(exp)))
      .sort((a, b) => b.stats.followers - a.stats.followers)
      .slice(0, limit);
  }

  /**
   * 获取热门话题
   */
  public getHotTopics(
    timeRange: { start: Date; end: Date },
    limit = 10,
  ): Array<{
    tag: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    const tagCounts = new Map<string, number>();

    // 统计标签出现次数
    Array.from(this.posts.values())
      .filter(post => post.createdAt >= timeRange.start && post.createdAt <= timeRange.end)
      .forEach(post => {
        post.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

    // 计算趋势
    const result = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({
        tag,
        count,
        trend: this.calculateTopicTrend(tag, timeRange),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return result;
  }

  /**
   * 计算话题趋势
   */
  private calculateTopicTrend(
    tag: string,
    timeRange: { start: Date; end: Date },
  ): 'up' | 'down' | 'stable' {
    const midPoint = new Date((timeRange.start.getTime() + timeRange.end.getTime()) / 2);

    const firstHalf = Array.from(this.posts.values()).filter(
      post =>
        post.createdAt >= timeRange.start && post.createdAt < midPoint && post.tags.includes(tag),
    ).length;

    const secondHalf = Array.from(this.posts.values()).filter(
      post =>
        post.createdAt >= midPoint && post.createdAt <= timeRange.end && post.tags.includes(tag),
    ).length;

    if (secondHalf > firstHalf * 1.2) return 'up';
    if (secondHalf < firstHalf * 0.8) return 'down';
    return 'stable';
  }

  /**
   * 获取用户动态
   */
  public getUserActivities(
    userId: string,
    limit = 20,
  ): Array<{
    type: 'post' | 'comment' | 'like';
    content: IPost | IComment;
    timestamp: Date;
  }> {
    const activities: Array<{
      type: 'post' | 'comment' | 'like';
      content: IPost | IComment;
      timestamp: Date;
    }> = [];

    // 收集用户的帖子
    Array.from(this.posts.values())
      .filter(post => post.authorId === userId)
      .forEach(post => {
        activities.push({
          type: 'post',
          content: post,
          timestamp: post.createdAt,
        });
      });

    // 收集用户的评论
    Array.from(this.comments.values())
      .flat()
      .filter(comment => comment.authorId === userId)
      .forEach(comment => {
        activities.push({
          type: 'comment',
          content: comment,
          timestamp: comment.createdAt,
        });
      });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  }

  /**
   * 从数据库加载用户数据
   */
  private async loadUsersFromDB(): Promise<void> {
    // 实现从数据库加载用户数据的逻辑
  }

  /**
   * 从数据库加载帖子数据
   */
  private async loadPostsFromDB(): Promise<void> {
    // 实现从数据库加载帖子数据的逻辑
  }

  /**
   * 从数据库加载评论数据
   */
  private async loadCommentsFromDB(): Promise<void> {
    // 实现从数据库加载评论数据的逻辑
  }

  /**
   * 从数据库加载群组数据
   */
  private async loadGroupsFromDB(): Promise<void> {
    // 实现从数据库加载群组数据的逻辑
  }

  /**
   * 保存用户
   */
  private async saveUser(user: IUser): Promise<void> {
    try {
      this.users.set(user.id, user);
      // 保存到数据库
      this.logger.info(`保存用户: ${user.id}`);
    } catch (error) {
      this.logger.error('保存用户失败', error);
      throw error;
    }
  }

  /**
   * 保存帖子
   */
  private async savePost(post: IPost): Promise<void> {
    try {
      this.posts.set(post.id, post);
      // 保存到数据库
      this.logger.info(`保存帖子: ${post.id}`);
    } catch (error) {
      this.logger.error('保存帖子失败', error);
      throw error;
    }
  }

  /**
   * 保存专家群组
   */
  private async saveExpertGroup(group: IExpertGroup): Promise<void> {
    try {
      this.expertGroups.set(group.id, group);
      // 保存到数据库
      this.logger.info(`保存专家群组: ${group.id}`);
    } catch (error) {
      this.logger.error('保存专家群组失败', error);
      throw error;
    }
  }
}
