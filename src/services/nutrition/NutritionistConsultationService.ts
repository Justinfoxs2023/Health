import {
  ConsultationSession,
  ConsultationMessage,
  NutritionistProfile,
  ConsultationSchedule,
  ConsultationReport,
  ConsultationStatus
} from '../types/consultation.types';
import { CacheService } from '../cache/CacheService';
import { DatabaseService } from '../database/DatabaseService';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { NotificationService } from '../notification/NotificationService';
import { WebSocketService } from '../communication/WebSocketService';
import { injectable, inject } from 'inversify';

@inject
able()
export class NutritionistConsultationService {
  constructor(
    @inject() private readonly logger: Logger,
    @inject() private readonly metrics: MetricsCollector,
    @inject() private readonly cache: CacheService,
    @inject() private readonly db: DatabaseService,
    @inject() private readonly notification: NotificationService,
    @inject() private readonly ws: WebSocketService
  ) {
    this.initializeWebSocket();
  }

  /**
   * 初始化WebSocket连接
   */
  private initializeWebSocket(): void {
    this.ws.on('consultation_message', this.handleConsultationMessage.bind(this));
    this.ws.on('consultation_start', this.handleConsultationStart.bind(this));
    this.ws.on('consultation_end', this.handleConsultationEnd.bind(this));
export interface Nutritionist {
  id: string;
  name: string;
  title: string;
  specialties: string;
  experience: number;
  education: string;
  certifications: string;
  languages: string;
  availability: Array{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  rating: number;
  consultations: number;
  status: 'available' | 'busy' | 'offline';
}

export interface IConsultationSession {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** nutritionistId 的描述 */
    nutritionistId: string;
  /** type 的描述 */
    type: chat  video  voice;
  status: scheduled  active  completed  cancelled;
  startTime: Date;
  endTime: Date;
  duration: number;
  topic: string;
  notes: string;
  attachments: string;
  rating: number;
  feedback: string;
}

export interface IConsultationRequest {
  /** userId 的描述 */
    userId: string;
  /** type 的描述 */
    type: chat  video  voice;
  preferredTime: Date;
  topic: string;
  preferences: {
    language: string;
    specialties: string;
    gender: string;
  };
}

@injectable()
export class NutritionistConsultationService {
  constructor(
    @inject() private logger: Logger,
    @inject() private databaseService: DatabaseService,
    @inject() private webSocketService: WebSocketService,
    @inject() private eventBus: EventBus,
    @inject() private notificationService: NotificationService
  ) {}

  /**
   * 获取可用营养师列表
   */
  public async getAvailableNutritionists(
    filters: {
      specialties?: string[];
      languages?: string[];
      availability?: {
        date: Date;
        startTime: string;
        endTime: string;
      };
      rating?: number;
    } = {}
  ): Promise<Nutritionist[]> {
    try {
      const query: any = {
        status: 'available'
      };

      if (filters.specialties?.length) {
        query.specialties = { $in: filters.specialties };
      }
      if (filters.languages?.length) {
        query.languages = { $in: filters.languages };
      }
      if (filters.rating) {
        query.rating = { $gte: filters.rating };
      }
      if (filters.availability) {
        query['availability.dayOfWeek'] = filters.availability.date.getDay();
        query['availability.startTime'] = { $lte: filters.availability.startTime };
        query['availability.endTime'] = { $gte: filters.availability.endTime };
      }

      const nutritionists = await this.databaseService.find(
        'nutritionists',
        query
      );

      return nutritionists;
    } catch (error) {
      this.logger.error('获取可用营养师列表失败', error);
      throw error;
    }
  }

  /**
   * 请求咨询
   */
  public async requestConsultation(
    request: IConsultationRequest
  ): Promise<ConsultationSession> {
    try {
      // 查找合适的营养师
      const nutritionist = await this.findMatchingNutritionist(request);
      if (!nutritionist) {
        throw new Error('未找到合适的营养师');
      }

      // 创建咨询会话
      const session: ConsultationSession = {
        id: crypto.randomUUID(),
        userId: request.userId,
        nutritionistId: nutritionist.id,
        type: request.type,
        status: 'scheduled',
        startTime: request.preferredTime,
        topic: request.topic
      };

      // 保存会话
      await this.databaseService.insert('consultation_sessions', session);

      // 通知营养师
      await this.notifyNutritionist(nutritionist.id, session);

      // 发布事件
      this.eventBus.publish('consultation.requested', {
        sessionId: session.id,
        userId: request.userId,
        nutritionistId: nutritionist.id
      });

      return session;
    } catch (error) {
      this.logger.error('请求咨询失败', error);
      throw error;
    }
  }

  /**
   * 开始咨询
   */
  public async startConsultation(
    sessionId: string
  ): Promise<void> {
    try {
      const session = await this.databaseService.findOne(
        'consultation_sessions',
        { id: sessionId }
      );

      if (!session) {
        throw new Error('咨询会话不存在');
      }

      if (session.status !== 'scheduled') {
        throw new Error('咨询会话状态无效');
      }

      // 更新会话状态
      await this.databaseService.update(
        'consultation_sessions',
        { id: sessionId },
        {
          $set: {
            status: 'active',
            startTime: new Date()
          }
        }
      );

      // 创建通信房间
      await this.webSocketService.createRoom(
        sessionId,
        [session.userId, session.nutritionistId]
      );

      // 发布事件
      this.eventBus.publish('consultation.started', {
        sessionId,
        userId: session.userId,
        nutritionistId: session.nutritionistId
      });
    } catch (error) {
      this.logger.error('开始咨询失败', error);
      throw error;
    }
  }

  /**
   * 结束咨询
   */
  public async endConsultation(
    sessionId: string,
    notes?: string
  ): Promise<void> {
    try {
      const session = await this.databaseService.findOne(
        'consultation_sessions',
        { id: sessionId }
      );

      if (!session) {
        throw new Error('咨询会话不存在');
      }

      if (session.status !== 'active') {
        throw new Error('咨询会话状态无效');
      }

      const endTime = new Date();
      const duration = endTime.getTime() - session.startTime.getTime();

      // 更新会话状态
      await this.databaseService.update(
        'consultation_sessions',
        { id: sessionId },
        {
          $set: {
            status: 'completed',
            endTime,
            duration,
            notes
          }
        }
      );

      // 关闭通信房间
      await this.webSocketService.closeRoom(sessionId);

      // 发送总结
      await this.sendConsultationSummary(session);

      // 发布事件
      this.eventBus.publish('consultation.ended', {
        sessionId,
        userId: session.userId,
        nutritionistId: session.nutritionistId,
        duration
      });
    } catch (error) {
      this.logger.error('结束咨询失败', error);
      throw error;
    }
  }

  /**
   * 取消咨询
   */
  public async cancelConsultation(
    sessionId: string,
    reason?: string
  ): Promise<void> {
    try {
      const session = await this.databaseService.findOne(
        'consultation_sessions',
        { id: sessionId }
      );

      if (!session) {
        throw new Error('咨询会话不存在');
      }

      if (!['scheduled', 'active'].includes(session.status)) {
        throw new Error('咨询会话状态无效');
      }

      // 更新会话状态
      await this.databaseService.update(
        'consultation_sessions',
        { id: sessionId },
        {
          $set: {
            status: 'cancelled',
            notes: reason
          }
        }
      );

      // 如果会话正在进行，关闭通信房间
      if (session.status === 'active') {
        await this.webSocketService.closeRoom(sessionId);
      }

      // 通知相关方
      await this.notifyCancellation(session, reason);

      // 发布事件
      this.eventBus.publish('consultation.cancelled', {
        sessionId,
        userId: session.userId,
        nutritionistId: session.nutritionistId,
        reason
      });
    } catch (error) {
      this.logger.error('取消咨询失败', error);
      throw error;
    }
  }

  /**
   * 评价咨询
   */
  public async rateConsultation(
    sessionId: string,
    rating: number,
    feedback?: string
  ): Promise<void> {
    try {
      const session = await this.databaseService.findOne(
        'consultation_sessions',
        { id: sessionId }
      );

      if (!session) {
        throw new Error('咨询会话不存在');
      }

      if (session.status !== 'completed') {
        throw new Error('咨询会话未完成');
      }

      // 更新会话评价
      await this.databaseService.update(
        'consultation_sessions',
        { id: sessionId },
        {
          $set: {
            rating,
            feedback
          }
        }
      );

      // 更新营养师评分
      await this.updateNutritionistRating(
        session.nutritionistId,
        rating
      );

      // 发布事件
      this.eventBus.publish('consultation.rated', {
        sessionId,
        userId: session.userId,
        nutritionistId: session.nutritionistId,
        rating,
        feedback
      });
    } catch (error) {
      this.logger.error('评价咨询失败', error);
      throw error;
    }
  }

  /**
   * 获取咨询历史
   */
  public async getConsultationHistory(
    userId: string
  ): Promise<ConsultationSession[]> {
    try {
      const sessions = await this.databaseService.find(
        'consultation_sessions',
        { userId }
      );

      return sessions;
    } catch (error) {
      this.logger.error('获取咨询历史失败', error);
      throw error;
    }
  }

  /**
   * 查找匹配的营养师
   */
  private async findMatchingNutritionist(
    request: IConsultationRequest
  ): Promise<Nutritionist | null> {
    try {
      const filters: any = {
        status: 'available'
      };

      if (request.preferences?.language) {
        filters.languages = request.preferences.language;
      }
      if (request.preferences?.specialties?.length) {
        filters.specialties = { $in: request.preferences.specialties };
      }
      if (request.preferences?.gender) {
        filters.gender = request.preferences.gender;
      }

      // 检查可用时间
      const dayOfWeek = request.preferredTime.getDay();
      const timeString = request.preferredTime.toTimeString().slice(0, 5);

      filters['availability'] = {
        $elemMatch: {
          dayOfWeek,
          startTime: { $lte: timeString },
          endTime: { $gte: timeString }
        }
      };

      const nutritionists = await this.databaseService.find(
        'nutritionists',
        filters,
        {
          sort: { rating: -1 },
          limit: 1
        }
      );

      return nutritionists[0] || null;
    } catch (error) {
      this.logger.error('查找匹配营养师失败', error);
      throw error;
    }
  }

  /**
   * 通知营养师
   */
  private async notifyNutritionist(
    nutritionistId: string,
    session: ConsultationSession
  ): Promise<void> {
    try {
      await this.notificationService.send({
        type: 'consultation_request',
        recipient: nutritionistId,
        data: {
          sessionId: session.id,
          userId: session.userId,
          type: session.type,
          startTime: session.startTime,
          topic: session.topic
        }
      });
    } catch (error) {
      this.logger.error('通知营养师失败', error);
      throw error;
    }
  }

  /**
   * 发送咨询总结
   */
  private async sendConsultationSummary(
    session: ConsultationSession
  ): Promise<void> {
    try {
      // 发送给用户
      await this.notificationService.send({
        type: 'consultation_summary',
        recipient: session.userId,
        data: {
          sessionId: session.id,
          nutritionistId: session.nutritionistId,
          duration: session.duration,
          notes: session.notes
        }
      });

      // 发送给营养师
      await this.notificationService.send({
        type: 'consultation_summary',
        recipient: session.nutritionistId,
        data: {
          sessionId: session.id,
          userId: session.userId,
          duration: session.duration,
          notes: session.notes
        }
      });
    } catch (error) {
      this.logger.error('发送咨询总结失败', error);
      throw error;
    }
  }

  /**
   * 通知取消
   */
  private async notifyCancellation(
    session: ConsultationSession,
    reason?: string
  ): Promise<void> {
    try {
      // 通知用户
      await this.notificationService.send({
        type: 'consultation_cancelled',
        recipient: session.userId,
        data: {
          sessionId: session.id,
          nutritionistId: session.nutritionistId,
          reason
        }
      });

      // 通知营养师
      await this.notificationService.send({
        type: 'consultation_cancelled',
        recipient: session.nutritionistId,
        data: {
          sessionId: session.id,
          userId: session.userId,
          reason
        }
      });
    } catch (error) {
      this.logger.error('通知取消失败', error);
      throw error;
    }
  }

  /**
   * 更新营养师评分
   */
  private async updateNutritionistRating(
    nutritionistId: string,
    rating: number
  ): Promise<void> {
    try {
      await this.databaseService.update(
        'nutritionists',
        { id: nutritionistId },
        {
          $inc: {
            consultations: 1,
            totalRating: rating
          },
          $set: {
            rating: {
              $divide: [
                { $add: ['$totalRating', rating] },
                { $add: ['$consultations', 1] }
              ]
            }
          }
        }
      );
    } catch (error) {
      this.logger.error('更新营养师评分失败', error);
      throw error;
    }
  }
}
