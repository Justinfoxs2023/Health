import { IEmailService, IEmailOptions, ISecurityNotification } from './types';
import { injectable } from 'inversify';

@injectable()
export class EmailServiceImpl implements IEmailService {
  async sendEmail(options: IEmailOptions): Promise<void> {
    // 实现邮件发送逻辑
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: '验证码',
      template: 'verification',
      context: { code },
    });
  }

  async sendSecurityAlert(to: string, notification: ISecurityNotification): Promise<void> {
    await this.sendEmail({
      to,
      subject: notification.title,
      template: 'security-alert',
      context: notification,
    });
  }
}
