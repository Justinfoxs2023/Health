import axios, { AxiosInstance } from 'axios';
import { INotificationMessage } from '../NotificationService';
import { Logger } from '../../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IWebhookConfig {
  /** url 的描述 */
    url: string;
  /** method 的描述 */
    method: GET  POST  PUT  PATCH;
  headers: Recordstring, string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
  validateSSL: boolean;
}

@injectable()
export class WebhookProvider {
  private client!: AxiosInstance;

  constructor(@inject() private readonly logger: Logger) {}

  /**
   * 初始化Webhook客户端
   */
  public initialize(config: IWebhookConfig): void {
    try {
      this.client = axios.create({
        timeout: config.timeout || 5000,
        headers: config.headers || {},
        validateStatus: status => status >= 200 && status < 300,
      });

      if (config.validateSSL === false) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      }

      this.logger.info('Webhook客户端初始化成功');
    } catch (error) {
      this.logger.error('Webhook客户端初始化失败', error as Error);
      throw error;
    }
  }

  /**
   * 发送Webhook通知
   */
  public async send(message: INotificationMessage & { config: IWebhookConfig }): Promise<void> {
    if (!this.client) {
      throw new Error('Webhook客户端未初始化');
    }

    const payload = this.formatPayload(message);
    let lastError: Error | null = null;
    const maxRetries = message.config.retryCount || 3;
    const retryDelay = message.config.retryDelay || 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.request({
          method: message.config.method,
          url: message.config.url,
          data: payload,
          headers: {
            ...message.config.headers,
            'Content-Type': 'application/json',
          },
        });

        this.logger.info(`Webhook调用成功: ${response.status}`);
        return;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          this.logger.warn(`Webhook调用失败，将在${retryDelay}ms后重试`, error);
          await this.delay(retryDelay);
        }
      }
    }

    throw new Error(`Webhook调用失败，已重试${maxRetries}次: ${lastError?.message}`);
  }

  /**
   * 格式化负载数据
   */
  private formatPayload(message: INotificationMessage): any {
    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      subject: message.subject,
      content: message.content,
      recipients: message.recipients,
      priority: message.priority || 'normal',
      attachments: message.attachments?.map(attachment => ({
        name: attachment.name,
        type: attachment.type,
        size: attachment.content.length,
      })),
      metadata: {
        channelId: message.channelId,
        templateId: message.templateId,
      },
    };
  }

  /**
   * 延迟执行
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 验证Webhook URL
   */
  public validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 测试Webhook连接
   */
  public async testConnection(config: IWebhookConfig): Promise<boolean> {
    try {
      const response = await this.client.request({
        method: config.method,
        url: config.url,
        headers: config.headers,
        data: {
          test: true,
          timestamp: new Date().toISOString(),
        },
      });

      return response.status >= 200 && response.status < 300;
    } catch (error) {
      this.logger.error('Webhook连接测试失败', error);
      return false;
    }
  }

  /**
   * 获取响应统计
   */
  public getStats(): {
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    averageResponseTime: number;
  } {
    // 这里可以实现实际的统计逻辑
    return {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      averageResponseTime: 0,
    };
  }
}
