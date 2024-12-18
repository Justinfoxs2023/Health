import { EmailProvider } from './providers/EmailProvider';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MonitoringEvents, EventSource, EventPriority } from '../communication/events';
import { SMSProvider } from './providers/SMSProvider';
import { SlackProvider } from './providers/SlackProvider';
import { WebhookProvider } from './providers/WebhookProvider';
import { injectable, inject } from 'inversify';

export interface INotificationTemplate {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: email  slack  webhook  sms;
  subject: string;
  content: string;
  variables: string;
}

export interface INotificationChannel {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: email  slack  webhook  sms;
  config: Recordstring, any;
  enabled: boolean;
  templates: Recordstring, NotificationTemplate;
}

export interface INotificationMessage {
  /** channelId 的描述 */
    channelId: string;
  /** templateId 的描述 */
    templateId: string;
  /** subject 的描述 */
    subject: string;
  /** content 的描述 */
    content: string;
  /** data 的描述 */
    data: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
  /** recipients 的描述 */
    recipients: string;
  /** priority 的描述 */
    priority: low  normal  high;
  attachments: Array{
    name: string;
    content: Buffer;
    type: string;
  }>;
}

/**
 * 通知服务
 */
@injectable()
export class NotificationService {
  private channels: Map<string, INotificationChannel> = new Map();
  private templates: Map<string, INotificationTemplate> = new Map();
  private providers: Map<string, any> = new Map();
  private retryQueue: Array<{
    message: INotificationMessage;
    retries: number;
    nextRetry: number;
  }> = [];
  private retryTimer?: NodeJS.Timeout;

  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
    @inject() private emailProvider: EmailProvider,
    @inject() private slackProvider: SlackProvider,
    @inject() private webhookProvider: WebhookProvider,
    @inject() private smsProvider: SMSProvider,
  ) {
    this.initializeProviders();
    this.startRetryTimer();
  }

  /**
   * 初始化通知提供者
   */
  private initializeProviders(): void {
    this.providers.set('email', this.emailProvider);
    this.providers.set('slack', this.slackProvider);
    this.providers.set('webhook', this.webhookProvider);
    this.providers.set('sms', this.smsProvider);
  }

  /**
   * 添加通知渠道
   */
  public addChannel(channel: INotificationChannel): void {
    if (this.channels.has(channel.id)) {
      throw new Error(`通知渠道 ${channel.id} 已存在`);
    }
    this.channels.set(channel.id, channel);
    this.logger.info(`添加通知渠道: ${channel.name}`);
  }

  /**
   * 添加通知模板
   */
  public addTemplate(template: INotificationTemplate): void {
    if (this.templates.has(template.id)) {
      throw new Error(`通知模板 ${template.id} 已存在`);
    }
    this.templates.set(template.id, template);
    this.logger.info(`添加通知模板: ${template.name}`);
  }

  /**
   * 发送通知
   */
  public async send(message: INotificationMessage): Promise<void> {
    const channel = this.channels.get(message.channelId);
    if (!channel || !channel.enabled) {
      throw new Error(`通知渠道 ${message.channelId} 不可用`);
    }

    const provider = this.providers.get(channel.type);
    if (!provider) {
      throw new Error(`通知提供者 ${channel.type} 不存在`);
    }

    try {
      const content = message.templateId
        ? await this.renderTemplate(message.templateId, message.data || {})
        : message.content;

      await provider.send({
        ...message,
        content,
        config: channel.config,
      });

      this.eventBus.publish(
        'notification.sent',
        {
          channelId: channel.id,
          templateId: message.templateId,
          recipients: message.recipients,
          timestamp: Date.now(),
        },
        {
          source: EventSource.SERVICE,
          priority: EventPriority.LOW,
        },
      );
    } catch (error) {
      this.logger.error(`发送通知失败: ${channel.name}`, error);
      await this.handleError(message, error as Error);
    }
  }

  /**
   * 渲染模板
   */
  private async renderTemplate(templateId: string, data: Record<string, any>): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`通知模板 ${templateId} 不存在`);
    }

    let content = template.content;
    for (const variable of template.variables) {
      const value = data[variable];
      if (value === undefined) {
        throw new Error(`模板变量 ${variable} 未提供`);
      }
      content = content.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), String(value));
    }

    return content;
  }

  /**
   * 处理错误
   */
  private async handleError(message: INotificationMessage, error: Error): Promise<void> {
    const maxRetries = 3;
    const retryDelay = 60000; // 1分钟

    const queueItem = this.retryQueue.find(
      item =>
        item.message.channelId === message.channelId &&
        item.message.templateId === message.templateId,
    );

    if (queueItem) {
      if (queueItem.retries < maxRetries) {
        queueItem.retries++;
        queueItem.nextRetry = Date.now() + retryDelay;
        this.logger.info(
          `通知将在 ${new Date(queueItem.nextRetry)} 重试，剩余重试次数: ${
            maxRetries - queueItem.retries
          }`,
        );
      } else {
        this.retryQueue = this.retryQueue.filter(item => item !== queueItem);
        this.eventBus.publish(
          'notification.failed',
          {
            error: error.message,
            message,
            retries: maxRetries,
            timestamp: Date.now(),
          },
          {
            source: EventSource.SERVICE,
            priority: EventPriority.HIGH,
          },
        );
      }
    } else {
      this.retryQueue.push({
        message,
        retries: 1,
        nextRetry: Date.now() + retryDelay,
      });
    }
  }

  /**
   * 启动重试定时器
   */
  private startRetryTimer(): void {
    this.retryTimer = setInterval(() => {
      this.processRetryQueue();
    }, 10000); // 每10秒检查一次
  }

  /**
   * 处理重试队列
   */
  private async processRetryQueue(): Promise<void> {
    const now = Date.now();
    const retryItems = this.retryQueue.filter(item => item.nextRetry <= now);

    for (const item of retryItems) {
      try {
        await this.send(item.message);
        this.retryQueue = this.retryQueue.filter(i => i !== item);
      } catch (error) {
        this.logger.error(`重试发送通知失败: ${item.message.channelId}`, error);
      }
    }
  }

  /**
   * 停止服务
   */
  public stop(): void {
    if (this.retryTimer) {
      clearInterval(this.retryTimer);
      this.retryTimer = undefined;
    }
  }

  /**
   * 获取渠道状态
   */
  public getChannelStatus(channelId: string): {
    channel: INotificationChannel;
    queuedMessages: number;
    lastError?: Error;
  } {
    const channel = this.channels.get(channelId);
    if (!channel) {
      throw new Error(`通知渠道 ${channelId} 不存在`);
    }

    const queuedMessages = this.retryQueue.filter(
      item => item.message.channelId === channelId,
    ).length;

    return {
      channel,
      queuedMessages,
    };
  }

  /**
   * 获取所有渠道状态
   */
  public getAllChannelStatus(): Record<
    string,
    {
      enabled: boolean;
      queuedMessages: number;
    }
  > {
    const status: Record<
      string,
      {
        enabled: boolean;
        queuedMessages: number;
      }
    > = {};

    for (const [channelId, channel] of this.channels.entries()) {
      const queuedMessages = this.retryQueue.filter(
        item => item.message.channelId === channelId,
      ).length;

      status[channelId] = {
        enabled: channel.enabled,
        queuedMessages,
      };
    }

    return status;
  }
}
