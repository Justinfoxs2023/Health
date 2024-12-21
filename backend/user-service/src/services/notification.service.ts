import { EmailService } from '../utils/email.service';
import { Logger } from '../utils/logger';
import { NotificationModel } from '../models/notification.model';
import { PushService } from '../utils/push.service';
import { SMSService } from '../utils/sms.service';

export class NotificationService {
  private emailService: EmailService;
  private pushService: PushService;
  private smsService: SMSService;
  private logger: Logger;

  constructor() {
    this.emailService = new EmailService();
    this.pushService = new PushService();
    this.smsService = new SMSService();
    this.logger = new Logger('NotificationService');
  }

  /**
   * 发送验证码
   */
  public async sendVerificationCode(type: 'email' | 'phone', target: string): Promise<void> {
    try {
      const code = this.generateVerificationCode();
      const key = `verification:${type}:${target}`;

      // 存储验证码
      await this.redis.setex(key, config.verification.codeTTL, code);

      // 发送验证码
      if (type === 'email') {
        await this.emailService.sendVerificationEmail(target, code);
      } else {
        await this.smsService.sendVerificationSMS(target, code);
      }
    } catch (error) {
      this.logger.error('发送验证码失败', error);
      throw error;
    }
  }

  /**
   * 发送新设备登录通知
   */
  public async sendNewDeviceAlert(userId: string, deviceInfo: any): Promise<void> {
    try {
      const user = await this.userService.findById(userId);
      const notification = {
        type: 'security_alert',
        title: '新设备登录提醒',
        content: `检测到您的账号在新设备上登录\n设备信息: ${deviceInfo.device}\n位置: ${
          deviceInfo.location
        }\n时间: ${new Date().toLocaleString()}`,
      };

      // 发送邮件通知
      if (user.email) {
        await this.emailService.sendSecurityAlert(user.email, notification);
      }

      // 发送推送通知
      if (user.pushToken) {
        await this.pushService.sendNotification(user.pushToken, notification);
      }

      // 记录通知
      await this.saveNotification(userId, notification);
    } catch (error) {
      this.logger.error('发送新设备登录通知失败', error);
      throw error;
    }
  }

  /**
   * 保存通知记录
   */
  private async saveNotification(userId: string, notification: any): Promise<void> {
    try {
      const newNotification = new NotificationModel({
        userId,
        ...notification,
        createdAt: new Date(),
      });

      await newNotification.save();
    } catch (error) {
      this.logger.error('保存通知记录失败', error);
      throw error;
    }
  }

  /**
   * 生成验证码
   */
  private generateVerificationCode(): string {
    return Math.random().toString().slice(2, 8);
  }
}
