import { injectable } from 'inversify';
import { EmailService, EmailOptions, SecurityNotification } from './types';

@injectable()
export class EmailServiceImpl implements EmailService {
  async sendEmail(options: EmailOptions): Promise<void> {
    // 实现邮件发送逻辑
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: '验证码',
      template: 'verification',
      context: { code }
    });
  }

  async sendSecurityAlert(to: string, notification: SecurityNotification): Promise<void> {
    await this.sendEmail({
      to,
      subject: notification.title,
      template: 'security-alert',
      context: notification
    });
  }
} 