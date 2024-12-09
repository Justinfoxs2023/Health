import { injectable } from 'inversify';
import { PushService, PushNotification } from './types';

@injectable()
export class PushServiceImpl implements PushService {
  async sendPushNotification(token: string, notification: PushNotification): Promise<void> {
    // 实现推送通知逻辑
  }
} 