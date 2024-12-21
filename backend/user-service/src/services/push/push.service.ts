import { IPushService, IPushNotification } from './types';
import { injectable } from 'inversify';

@injectable()
export class PushServiceImpl implements IPushService {
  async sendPushNotification(token: string, notification: IPushNotification): Promise<void> {
    // 实现推送通知逻辑
  }
}
