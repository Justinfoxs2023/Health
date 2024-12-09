import { Logger } from '@/utils/Logger';
import { CommunityError } from '@/utils/errors';
import { Post, Comment, ExpertResponse } from '../models/CommunityTypes';
import { UserService } from '../user/UserService';
import { NotificationService } from '../notification/NotificationService';
import { ContentModerationService } from './ContentModerationService';
import { ExpertMatchingService } from './ExpertMatchingService';

export class CommunityService {
  private logger: Logger;
  private userService: UserService;
  private notification: NotificationService;
  private moderation: ContentModerationService;
  private expertMatching: ExpertMatchingService;

  constructor() {
    this.logger = new Logger('Community');
    this.userService = new UserService();
    this.notification = new NotificationService();
    this.moderation = new ContentModerationService();
    this.expertMatching = new ExpertMatchingService();
  }

  /**
   * 创建帖子
   */
  async createPost(post: Post): Promise<void> {
    try {
      // 1. 验证用户权限
      await this.validateUserPermission(post.userId);

      // 2. 内容审核
      await this.moderation.moderateContent(post.content);

      // 3. 处理标签
      const processedTags = await this.processTags(post.tags);

      // 4. 保存帖子
      const savedPost = await this.savePost({
        ...post,
        tags: processedTags,
        createdAt: new Date(),
        status: 'published'
      });

      // 5. 通知相关用户
      await this.notifyRelevantUsers(savedPost);

      // 6. 更新用户活跃度
      await this.updateUserActivity(post.userId, 'post_created');

      this.logger.info('帖子创建成功', { postId: savedPost.id });
    } catch (error) {
      this.logger.error('帖子创建失败', error);
      throw new CommunityError('POST_CREATION_FAILED', error.message);
    }
  }

  /**
   * 获取专家建议
   */
  async getExpertAdvice(question: string): Promise<ExpertResponse> {
    try {
      // 1. 分析问题类型
      const questionType = await this.analyzeQuestion(question);

      // 2. 匹配合适的专家
      const expert = await this.expertMatching.findMatchingExpert(questionType);

      // 3. 创建咨询会话
      const session = await this.createConsultationSession(question, expert.id);

      // 4. 发送通知给专家
      await this.notification.notifyExpert(expert.id, session.id);

      // 5. 等待专家响应
      const response = await this.waitForExpertResponse(session.id);

      // 6. 处理响应
      return this.processExpertResponse(response);
    } catch (error) {
      this.logger.error('获取专家建议失败', error);
      throw new CommunityError('EXPERT_ADVICE_FAILED', error.message);
    }
  }

  /**
   * 添加评论
   */
  async addComment(postId: string, comment: Comment): Promise<void> {
    try {
      // 1. 验证帖子状态
      await this.validatePostStatus(postId);

      // 2. 内容审核
      await this.moderation.moderateContent(comment.content);

      // 3. 保存评论
      const savedComment = await this.saveComment({
        ...comment,
        postId,
        createdAt: new Date()
      });

      // 4. 通知帖子作者
      await this.notifyPostAuthor(postId, savedComment);

      // 5. 更新用户活跃度
      await this.updateUserActivity(comment.userId, 'comment_added');
    } catch (error) {
      this.logger.error('评论添加失败', error);
      throw new CommunityError('COMMENT_CREATION_FAILED', error.message);
    }
  }

  /**
   * 搜索帖子
   */
  async searchPosts(query: string, filters: any): Promise<Post[]> {
    try {
      // 1. 处理搜索参数
      const searchParams = this.processSearchParams(query, filters);

      // 2. 执行搜索
      const searchResults = await this.executeSearch(searchParams);

      // 3. 过滤结果
      const filteredResults = await this.filterSearchResults(searchResults);

      // 4. 排序结果
      return this.sortSearchResults(filteredResults);
    } catch (error) {
      this.logger.error('帖子搜索失败', error);
      throw new CommunityError('POST_SEARCH_FAILED', error.message);
    }
  }

  // 私有方法
  private async validateUserPermission(userId: string): Promise<void> {
    const user = await this.userService.getUserById(userId);
    if (user.status !== 'active') {
      throw new CommunityError('USER_NOT_ACTIVE', '用户状态不活跃');
    }
    if (user.isBanned) {
      throw new CommunityError('USER_BANNED', '用户已被禁言');
    }
  }

  private async processTags(tags: string[]): Promise<string[]> {
    // 处理标签逻辑
    return tags.map(tag => tag.toLowerCase().trim());
  }

  private async notifyRelevantUsers(post: Post): Promise<void> {
    // 通知相关用户逻辑
    const relevantUsers = await this.findRelevantUsers(post);
    await Promise.all(
      relevantUsers.map(userId =>
        this.notification.sendNotification(userId, {
          type: 'new_post',
          postId: post.id,
          title: post.title
        })
      )
    );
  }

  private async analyzeQuestion(question: string): Promise<string> {
    // 分析问题类型逻辑
    return this.expertMatching.analyzeQuestionType(question);
  }

  private async createConsultationSession(
    question: string,
    expertId: string
  ): Promise<any> {
    // 创建咨询会话逻辑
    return {
      id: 'session_id',
      question,
      expertId,
      status: 'pending'
    };
  }

  private async processExpertResponse(response: any): Promise<ExpertResponse> {
    // 处理专家响应逻辑
    return {
      expertId: response.expertId,
      content: response.content,
      attachments: response.attachments,
      createdAt: new Date()
    };
  }
} 