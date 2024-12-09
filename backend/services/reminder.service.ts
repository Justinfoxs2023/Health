import { Schedule } from 'node-schedule';
import { Logger } from '../utils/logger';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';

export class ReminderService {
  private logger: Logger;
  private notificationService: NotificationService;

  constructor() {
    this.logger = new Logger('ReminderService');
    this.notificationService = new NotificationService();
    this.initScheduledReminders();
  }

  private initScheduledReminders() {
    // 每月1号检查并发送提醒
    Schedule.scheduleJob('0 0 1 * *', async () => {
      await this.checkAndSendReminders();
    });
  }

  private async checkAndSendReminders() {
    try {
      // 获取需要更新问卷的用户
      const users = await User.find({
        'lastSurveyDate': {
          $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30天前
        }
      });

      for (const user of users) {
        await this.notificationService.sendNotification(user.id, {
          type: 'SURVEY_REMINDER',
          title: '健康问卷更新提醒',
          content: '建议您定期更新健康问卷，以获得更准确的健康分析',
          action: '/survey'
        });
      }
    } catch (error) {
      this.logger.error('发送问卷提醒失败', error);
    }
  }
} 