import * as nodemailer from 'nodemailer';
import { INotificationMessage } from '../NotificationService';
import { Logger } from '../../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IEmailConfig {
  /** host 的描述 */
  host: string;
  /** port 的描述 */
  port: number;
  /** secure 的描述 */
  secure: false | true;
  /** auth 的描述 */
  auth: {
    user: string;
    pass: string;
  };
  /** from 的描述 */
  from: string;
}

@injectable()
export class EmailProvider {
  private transporter!: nodemailer.Transporter;

  constructor(@inject() private readonly logger: Logger) {}

  /**
   * 初始化邮件传输器
   */
  public async initialize(config: IEmailConfig): Promise<void> {
    try {
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.auth.user,
          pass: config.auth.pass,
        },
      });

      // 验证配置
      await this.transporter.verify();
      this.logger.info('邮件服务连接成功');
    } catch (error) {
      this.logger.error('邮件服务初始化失败', error as Error);
      throw error;
    }
  }

  /**
   * 发送邮件
   */
  public async send(message: INotificationMessage & { config: IEmailConfig }): Promise<void> {
    if (!this.transporter) {
      throw new Error('邮件服务未初始化');
    }

    try {
      const mailOptions = {
        from: message.config.from,
        to: message.recipients.join(', '),
        subject: message.subject,
        html: message.content,
        attachments: message.attachments?.map(attachment => ({
          filename: attachment.name,
          content: attachment.content,
          contentType: attachment.type,
        })),
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.info(`邮件发送成功: ${message.subject}`);
    } catch (error) {
      this.logger.error('邮件发送失败', error as Error);
      throw error;
    }
  }

  /**
   * 关闭连接
   */
  public async close(): Promise<void> {
    if (this.transporter) {
      await this.transporter.close();
      this.logger.info('邮件服务连接已关闭');
    }
  }

  /**
   * 验证邮件地址格式
   */
  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 批量验证邮件地址
   */
  public validateEmails(emails: string[]): string[] {
    return emails.filter(email => !this.validateEmail(email));
  }

  /**
   * 测试连接
   */
  public async testConnection(config: IEmailConfig): Promise<boolean> {
    try {
      const testTransporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.auth.user,
          pass: config.auth.pass,
        },
      });

      await testTransporter.verify();
      await testTransporter.close();
      return true;
    } catch (error) {
      this.logger.error('邮件服务连接测试失败', error as Error);
      return false;
    }
  }

  /**
   * 获取发送统计
   */
  public getStats(): {
    sent: number;
    failed: number;
    lastError?: Error;
  } {
    // 这里可以实现实际的统计逻辑
    return {
      sent: 0,
      failed: 0,
    };
  }
}
