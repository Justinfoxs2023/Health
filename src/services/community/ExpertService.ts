import { CacheManager } from '../cache/CacheManager';
import { EventBus } from '../communication/EventBus';
import { IUser } from './CommunityService';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IExpertProfile extends IUser {
  /** certification 的描述 */
    certification: {
    title: string;
    organization: string;
    licenseNumber: string;
    validUntil: Date;
    verifiedAt?: Date;
    verifiedBy?: string;
  };
  /** specialties 的描述 */
    specialties: string[];
  /** experience 的描述 */
    experience: Array<{
    title: string;
    organization: string;
    period: {
      start: Date;
      end?: Date;
    };
    description: string;
  }>;
  /** education 的描述 */
    education: Array<{
    degree: string;
    school: string;
    major: string;
    period: {
      start: Date;
      end: Date;
    };
  }>;
  /** publications 的描述 */
    publications?: undefined | { title: string; journal: string; year: number; url?: string | undefined; }[];
  /** availability 的描述 */
    availability: {
    schedule: Array<{
      dayOfWeek: number;
      timeSlots: Array<{
        start: string;
        end: string;
      }>;
    }>;
    exceptions?: Array<{
      date: Date;
      available: boolean;
      reason?: string;
    }>;
  };
}

export interface IConsultationRequest {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** expertId 的描述 */
    expertId: string;
  /** type 的描述 */
    type: text  voice  video;
  topic: string;
  description: string;
  attachments: Array{
    type: string;
    url: string;
    name: string;
  }>;
  preferredTime: Array<{
    start: Date;
    end: Date;
  }>;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  scheduledTime?: Date;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConsultationSession {
  /** id 的描述 */
    id: string;
  /** requestId 的描述 */
    requestId: string;
  /** type 的描述 */
    type: text  voice  video;
  status: scheduled  ongoing  completed  cancelled;
  startTime: Date;
  endTime: Date;
  duration: number;
  notes: string;
  rating: {
    score: number;
    comment: string;
    createdAt: Date;
  };
  records: Array<{
    type: 'message' | 'file' | 'prescription';
    content: any;
    timestamp: Date;
  }>;
}

export interface IKnowledgeArticle {
  /** id 的描述 */
    id: string;
  /** authorId 的描述 */
    authorId: string;
  /** title 的描述 */
    title: string;
  /** content 的描述 */
    content: string;
  /** category 的描述 */
    category: string;
  /** tags 的描述 */
    tags: string;
  /** status 的描述 */
    status: draft  published  archived;
  visibility: public  private  expertonly;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  references: Array{
    title: string;
    url: string;
    type: string;
  }>;
}

@injectable()
export class ExpertService {
  private experts: Map<string, IExpertProfile> = new Map();
  private consultations: Map<string, IConsultationRequest> = new Map();
  private sessions: Map<string, IConsultationSession> = new Map();
  private articles: Map<string, IKnowledgeArticle> = new Map();

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
      const [cachedExperts, cachedConsultations, cachedSessions, cachedArticles] =
        await Promise.all([
          this.cacheManager.get('expert:experts'),
          this.cacheManager.get('expert:consultations'),
          this.cacheManager.get('expert:sessions'),
          this.cacheManager.get('expert:articles'),
        ]);

      if (cachedExperts && cachedConsultations && cachedSessions && cachedArticles) {
        this.experts = new Map(Object.entries(cachedExperts));
        this.consultations = new Map(Object.entries(cachedConsultations));
        this.sessions = new Map(Object.entries(cachedSessions));
        this.articles = new Map(Object.entries(cachedArticles));
      } else {
        await Promise.all([
          this.loadExpertsFromDB(),
          this.loadConsultationsFromDB(),
          this.loadSessionsFromDB(),
          this.loadArticlesFromDB(),
        ]);
      }

      this.logger.info('专家服务数据初始化成功');
    } catch (error) {
      this.logger.error('专家服务数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 申请专家认证
   */
  public async applyForExpert(
    userId: string,
    profile: Omit<IExpertProfile, 'id' | 'role' | 'stats' | 'badges'>,
  ): Promise<IExpertProfile> {
    try {
      const expert: IExpertProfile = {
        ...profile,
        id: userId,
        role: 'expert',
        stats: {
          posts: 0,
          followers: 0,
          following: 0,
          likes: 0,
        },
        badges: [],
      };

      await this.saveExpert(expert);

      this.eventBus.publish('expert.application.submitted', {
        expertId: expert.id,
        timestamp: Date.now(),
      });

      return expert;
    } catch (error) {
      this.logger.error('申请专家认证失败', error);
      throw error;
    }
  }

  /**
   * 发起咨询请求
   */
  public async createConsultation(
    userId: string,
    expertId: string,
    request: Omit<
      IConsultationRequest,
      'id' | 'userId' | 'expertId' | 'status' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<IConsultationRequest> {
    try {
      const expert = this.experts.get(expertId);
      if (!expert) {
        throw new Error(`专家不存在: ${expertId}`);
      }

      const consultation: IConsultationRequest = {
        id: Date.now().toString(),
        userId,
        expertId,
        ...request,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.saveConsultation(consultation);

      this.eventBus.publish('consultation.request.created', {
        consultationId: consultation.id,
        userId,
        expertId,
        timestamp: Date.now(),
      });

      return consultation;
    } catch (error) {
      this.logger.error('创建咨询请求失败', error);
      throw error;
    }
  }

  /**
   * 处理咨询请求
   */
  public async handleConsultation(
    consultationId: string,
    expertId: string,
    action: 'accept' | 'reject',
    scheduledTime?: Date,
  ): Promise<IConsultationRequest> {
    try {
      const consultation = this.consultations.get(consultationId);
      if (!consultation) {
        throw new Error(`咨询请求不存在: ${consultationId}`);
      }

      if (consultation.expertId !== expertId) {
        throw new Error('无权处理此咨询请���');
      }

      consultation.status = action === 'accept' ? 'accepted' : 'rejected';
      consultation.scheduledTime = scheduledTime;
      consultation.updatedAt = new Date();

      await this.saveConsultation(consultation);

      if (action === 'accept') {
        // 创建咨询会话
        const session: IConsultationSession = {
          id: Date.now().toString(),
          requestId: consultationId,
          type: consultation.type,
          status: 'scheduled',
          startTime: scheduledTime,
          records: [],
        };

        await this.saveSession(session);
      }

      this.eventBus.publish('consultation.request.handled', {
        consultationId,
        action,
        timestamp: Date.now(),
      });

      return consultation;
    } catch (error) {
      this.logger.error('处理咨询请求失败', error);
      throw error;
    }
  }

  /**
   * 发布知识文章
   */
  public async publishArticle(
    authorId: string,
    article: Omit<
      IKnowledgeArticle,
      'id' | 'authorId' | 'views' | 'likes' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<IKnowledgeArticle> {
    try {
      const expert = this.experts.get(authorId);
      if (!expert) {
        throw new Error(`专家不存在: ${authorId}`);
      }

      const newArticle: IKnowledgeArticle = {
        id: Date.now().toString(),
        authorId,
        ...article,
        views: 0,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.saveArticle(newArticle);

      this.eventBus.publish('expert.article.published', {
        articleId: newArticle.id,
        authorId,
        timestamp: Date.now(),
      });

      return newArticle;
    } catch (error) {
      this.logger.error('发布知识文章失败', error);
      throw error;
    }
  }

  /**
   * 搜索专家
   */
  public searchExperts(query: {
    specialties?: string[];
    availability?: {
      dayOfWeek: number;
      timeSlot: {
        start: string;
        end: string;
      };
    };
    location?: string;
    priceRange?: {
      min: number;
      max: number;
    };
  }): IExpertProfile[] {
    return Array.from(this.experts.values())
      .filter(expert => {
        if (query.specialties) {
          return query.specialties.some(specialty => expert.specialties.includes(specialty));
        }

        if (query.availability) {
          const schedule = expert.availability.schedule.find(
            s => s.dayOfWeek === query.availability!.dayOfWeek,
          );
          if (!schedule) return false;

          return schedule.timeSlots.some(slot =>
            this.isTimeSlotOverlap(slot, query.availability!.timeSlot),
          );
        }

        return true;
      })
      .sort((a, b) => b.stats.followers - a.stats.followers);
  }

  /**
   * 检查时间段重叠
   */
  private isTimeSlotOverlap(
    slot1: { start: string; end: string },
    slot2: { start: string; end: string },
  ): boolean {
    const [start1, end1] = [this.parseTime(slot1.start), this.parseTime(slot1.end)];
    const [start2, end2] = [this.parseTime(slot2.start), this.parseTime(slot2.end)];

    return start1 <= end2 && start2 <= end1;
  }

  /**
   * 解析时间字符串
   */
  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * 获取专家统计数据
   */
  public getExpertStats(expertId: string): {
    consultations: {
      total: number;
      completed: number;
      rating: number;
    };
    articles: {
      total: number;
      views: number;
      likes: number;
    };
    earnings: {
      total: number;
      thisMonth: number;
      lastMonth: number;
    };
  } {
    const consultations = Array.from(this.consultations.values()).filter(
      c => c.expertId === expertId,
    );

    const articles = Array.from(this.articles.values()).filter(a => a.authorId === expertId);

    const completedConsultations = consultations.filter(c => c.status === 'completed');

    const sessions = Array.from(this.sessions.values()).filter(s =>
      consultations.some(c => c.id === s.requestId),
    );

    const ratings = sessions.filter(s => s.rating).map(s => s.rating!.score);

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return {
      consultations: {
        total: consultations.length,
        completed: completedConsultations.length,
        rating: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
      },
      articles: {
        total: articles.length,
        views: articles.reduce((sum, article) => sum + article.views, 0),
        likes: articles.reduce((sum, article) => sum + article.likes, 0),
      },
      earnings: {
        total: completedConsultations.reduce((sum, c) => sum + c.price, 0),
        thisMonth: completedConsultations
          .filter(c => c.updatedAt >= thisMonth)
          .reduce((sum, c) => sum + c.price, 0),
        lastMonth: completedConsultations
          .filter(c => c.updatedAt >= lastMonth && c.updatedAt < thisMonth)
          .reduce((sum, c) => sum + c.price, 0),
      },
    };
  }

  /**
   * 从数据库加载专家数据
   */
  private async loadExpertsFromDB(): Promise<void> {
    // 实现从数据库加载专家数据的逻辑
  }

  /**
   * 从数据库加载咨询数据
   */
  private async loadConsultationsFromDB(): Promise<void> {
    // 实现从数据库加载咨询数据的逻辑
  }

  /**
   * 从数据库加载会话数据
   */
  private async loadSessionsFromDB(): Promise<void> {
    // 实现从数据库加载会话数据的逻辑
  }

  /**
   * 从数据库加载文章数据
   */
  private async loadArticlesFromDB(): Promise<void> {
    // 实现从数据库加载文章数据的逻辑
  }

  /**
   * 保存专家数据
   */
  private async saveExpert(expert: IExpertProfile): Promise<void> {
    try {
      this.experts.set(expert.id, expert);
      // 保存到数据库
      this.logger.info(`保存专家数据: ${expert.id}`);
    } catch (error) {
      this.logger.error('保存专家数据失败', error);
      throw error;
    }
  }

  /**
   * 保存咨询请求
   */
  private async saveConsultation(consultation: IConsultationRequest): Promise<void> {
    try {
      this.consultations.set(consultation.id, consultation);
      // 保存到数据库
      this.logger.info(`保存咨询请求: ${consultation.id}`);
    } catch (error) {
      this.logger.error('保存咨询请求失败', error);
      throw error;
    }
  }

  /**
   * 保存咨询会话
   */
  private async saveSession(session: IConsultationSession): Promise<void> {
    try {
      this.sessions.set(session.id, session);
      // 保存到数据库
      this.logger.info(`保存咨询会话: ${session.id}`);
    } catch (error) {
      this.logger.error('保存咨询会话失败', error);
      throw error;
    }
  }

  /**
   * 保存知识文章
   */
  private async saveArticle(article: IKnowledgeArticle): Promise<void> {
    try {
      this.articles.set(article.id, article);
      // 保存到数据库
      this.logger.info(`保存知识文章: ${article.id}`);
    } catch (error) {
      this.logger.error('保存知识文章失败', error);
      throw error;
    }
  }
}
