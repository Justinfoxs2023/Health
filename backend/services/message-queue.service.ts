import { RedisClient } from 'redis';
import { EventEmitter } from 'events';
import { HealthMetrics } from '../interfaces/health.interface';

// 健康数据消息类型
type HealthMessageType = 
  | 'health_data_update'    // 健康数据更新
  | 'alert_notification'    // 健康预警通知
  | 'reminder'             // 健康提醒
  | 'report_generation'    // 报告生成
  | 'sync_request';        // 数据同步请求

interface HealthMessage {
  id: string;
  type: HealthMessageType;
  userId: string;
  data: {
    metrics?: Partial<HealthMetrics>;
    alertType?: string;
    reminderType?: string;
    reportType?: string;
    syncData?: any;
    timestamp: Date;
  };
  priority: 1 | 2 | 3;  // 1: 高优先级(预警), 2: 中优先级(实时数据), 3: 低优先级(报告)
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  createdAt: Date;
  processedAt?: Date;
}

interface QueueConfig {
  maxRetries: number;
  retryDelay: number;
  processingTimeout: number;
  maxQueueSize: number;
  batchSize: number;
}

export class HealthMessageQueue extends EventEmitter {
  private redis: RedisClient;
  private config: QueueConfig;
  private handlers: Map<HealthMessageType, Set<(message: HealthMessage) => Promise<void>>>;
  private processingMessages: Map<string, NodeJS.Timeout>;

  constructor(config: QueueConfig) {
    super();
    this.config = config;
    this.handlers = new Map();
    this.processingMessages = new Map();
    this.initializeRedis();
  }

  // 发布健康数据更新消息
  async publishHealthUpdate(
    userId: string,
    metrics: Partial<HealthMetrics>
  ): Promise<string> {
    return this.publishMessage({
      type: 'health_data_update',
      userId,
      data: {
        metrics,
        timestamp: new Date()
      },
      priority: 2
    });
  }

  // 发布健康预警消息
  async publishHealthAlert(
    userId: string,
    alertType: string,
    metrics: Partial<HealthMetrics>
  ): Promise<string> {
    return this.publishMessage({
      type: 'alert_notification',
      userId,
      data: {
        alertType,
        metrics,
        timestamp: new Date()
      },
      priority: 1
    });
  }

  // 发布健康提醒消息
  async publishReminder(
    userId: string,
    reminderType: string
  ): Promise<string> {
    return this.publishMessage({
      type: 'reminder',
      userId,
      data: {
        reminderType,
        timestamp: new Date()
      },
      priority: 2
    });
  }

  // 订阅消息处理
  async subscribe(
    type: HealthMessageType,
    handler: (message: HealthMessage) => Promise<void>
  ): Promise<void> {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // 开始处理该类型的消息
    this.startProcessing(type);
  }

  // 取消订阅
  async unsubscribe(
    type: HealthMessageType,
    handler: (message: HealthMessage) => Promise<void>
  ): Promise<void> {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private async publishMessage(
    messageData: Omit<HealthMessage, 'id' | 'status' | 'attempts' | 'createdAt'>
  ): Promise<string> {
    const message: HealthMessage = {
      ...messageData,
      id: this.generateMessageId(),
      status: 'pending',
      attempts: 0,
      createdAt: new Date()
    };

    try {
      await this.checkQueueSize(message.type);
      await this.addToQueue(message);
      this.emit('messagePublished', message);
      return message.id;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  private async processMessage(message: HealthMessage): Promise<void> {
    const handlers = this.handlers.get(message.type);
    if (!handlers || handlers.size === 0) return;

    try {
      message.status = 'processing';
      await this.updateMessage(message);

      // 设置处理超时
      const timeout = setTimeout(() => {
        this.handleMessageTimeout(message);
      }, this.config.processingTimeout);
      
      this.processingMessages.set(message.id, timeout);

      // 并行执行所有处理器
      await Promise.all(
        Array.from(handlers).map(handler => handler(message))
      );

      // 完成处理
      clearTimeout(timeout);
      this.processingMessages.delete(message.id);
      message.status = 'completed';
      message.processedAt = new Date();
      await this.updateMessage(message);
      
      this.emit('messageProcessed', message);
    } catch (error) {
      await this.handleProcessingError(message, error);
    }
  }

  private async handleProcessingError(
    message: HealthMessage,
    error: Error
  ): Promise<void> {
    console.error(`消息处理错误 (${message.id}): ${error.message}`);
    
    if (message.attempts < this.config.maxRetries) {
      await this.retryMessage(message);
    } else {
      await this.handleMessageFailure(message);
    }
  }

  private async retryMessage(message: HealthMessage): Promise<void> {
    message.attempts++;
    message.status = 'pending';
    
    // 计算延迟时间
    const delay = this.config.retryDelay * Math.pow(2, message.attempts - 1);
    
    setTimeout(async () => {
      await this.addToQueue(message);
      this.emit('messageRetry', message);
    }, delay);
  }

  private async handleMessageFailure(message: HealthMessage): Promise<void> {
    message.status = 'failed';
    await this.updateMessage(message);
    this.emit('messageFailed', message);

    // 对于重要消息,发送告警
    if (message.priority === 1) {
      this.emit('criticalMessageFailed', message);
    }
  }

  // Redis操作
  private async addToQueue(message: HealthMessage): Promise<void> {
    const score = this.calculatePriorityScore(message);
    await new Promise((resolve, reject) => {
      this.redis.zadd(
        `health:queue:${message.type}`,
        score,
        JSON.stringify(message),
        (error) => {
          if (error) reject(error);
          resolve(null);
        }
      );
    });
  }

  private calculatePriorityScore(message: HealthMessage): number {
    // 优先级分数 = 时间戳 + 优先级权重
    const priorityWeight = (4 - message.priority) * 10000000;
    return Date.now() - priorityWeight;
  }

  private async getNextBatch(
    type: HealthMessageType,
    batchSize: number
  ): Promise<HealthMessage[]> {
    return new Promise((resolve, reject) => {
      this.redis.zrange(
        `health:queue:${type}`,
        0,
        batchSize - 1,
        (error, data) => {
          if (error) reject(error);
          resolve(data ? data.map(item => JSON.parse(item)) : []);
        }
      );
    });
  }

  private async updateMessage(message: HealthMessage): Promise<void> {
    await new Promise((resolve, reject) => {
      this.redis.hset(
        'health:messages',
        message.id,
        JSON.stringify(message),
        (error) => {
          if (error) reject(error);
          resolve(null);
        }
      );
    });
  }

  // 辅助方法
  private generateMessageId(): string {
    return `hmsg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async checkQueueSize(type: HealthMessageType): Promise<void> {
    const size = await new Promise<number>((resolve, reject) => {
      this.redis.zcard(`health:queue:${type}`, (error, count) => {
        if (error) reject(error);
        resolve(count || 0);
      });
    });

    if (size >= this.config.maxQueueSize) {
      throw new Error(`队列已满: ${type}`);
    }
  }

  private startProcessing(type: HealthMessageType): void {
    const processBatch = async () => {
      try {
        const messages = await this.getNextBatch(type, this.config.batchSize);
        await Promise.all(messages.map(msg => this.processMessage(msg)));
      } catch (error) {
        this.emit('error', error);
      }
      
      // 继续处理
      setTimeout(processBatch, 100);
    };

    processBatch();
  }

  private initializeRedis(): void {
    this.redis = new RedisClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });

    this.redis.on('error', (error) => {
      console.error('Redis连接错误:', error);
      this.emit('error', error);
    });
  }
} 