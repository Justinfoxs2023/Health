import nodemailer from 'nodemailer';
import { Logger } from './logger';

export class EmailService {
  private transporter: any;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('EmailService');
    this.initTransporter();
  }

  private initTransporter() {
    this.transporter = nodemailer.createTransport({
      // 配置邮件服务器
    });
  }

  async sendEmail(to: string, subject: string, content: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: content,
      });
      return true;
    } catch (error) {
      this.logger.error('发送邮件失败', error);
      throw error;
    }
  }
}
