import { INotificationMessage } from '../NotificationService';
import { Logger } from '../../logger/Logger';
import { WebClient } from '@slack/web-api';
import { injectable, inject } from 'inversify';

export interface ISlackConfig {
  /** token 的描述 */
  token: string;
  /** defaultChannel 的描述 */
  defaultChannel: string;
}

@injectable()
export class SlackProvider {
  private client: WebClient;

  constructor(@inject() private logger: Logger) {}

  /**
   * 初始化Slack客户端
   */
  public initialize(config: ISlackConfig): void {
    try {
      this.client = new WebClient(config.token);
      this.logger.info('Slack客户端初始化成功');
    } catch (error) {
      this.logger.error('Slack客户端初始化失败', error);
      throw error;
    }
  }

  /**
   * 发送Slack消息
   */
  public async send(message: INotificationMessage & { config: ISlackConfig }): Promise<void> {
    if (!this.client) {
      throw new Error('Slack客户端未初始化');
    }

    try {
      const blocks = this.formatMessageBlocks(message);

      for (const recipient of message.recipients) {
        await this.client.chat.postMessage({
          channel: recipient || message.config.defaultChannel,
          text: message.content,
          blocks,
        });
      }

      this.logger.info(`Slack消息发送成功: ${message.subject || '无主题'}`);
    } catch (error) {
      this.logger.error('Slack消息发送失败', error);
      throw error;
    }
  }

  /**
   * 格式化消息块
   */
  private formatMessageBlocks(message: INotificationMessage): any[] {
    const blocks = [];

    // 添加标题块
    if (message.subject) {
      blocks.push({
        type: 'header',
        text: {
          type: 'plain_text',
          text: message.subject,
        },
      });
    }

    // 添加内容块
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: message.content,
      },
    });

    // 添加附件块
    if (message.attachments?.length) {
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `📎 包含 ${message.attachments.length} 个附件`,
          },
        ],
      });
    }

    return blocks;
  }

  /**
   * 验证频道名称
   */
  public validateChannel(channel: string): boolean {
    return channel.startsWith('#') || channel.startsWith('@');
  }

  /**
   * 获取频道列表
   */
  public async getChannels(): Promise<Array<{ id: string; name: string }>> {
    try {
      const result = await this.client.conversations.list();
      return (result.channels || []).map(channel => ({
        id: channel.id as string,
        name: channel.name as string,
      }));
    } catch (error) {
      this.logger.error('获取Slack频道列表失败', error);
      throw error;
    }
  }

  /**
   * 测试连接
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.client.auth.test();
      return true;
    } catch (error) {
      this.logger.error('Slack连接测试失败', error);
      return false;
    }
  }
}
