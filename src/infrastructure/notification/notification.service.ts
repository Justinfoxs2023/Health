import { ConfigService } from '../config/config.service';
import { Injectable } from '@nestjs/common';

export interface INotificationMessage {
  /** type 的描述 */
    type: string;
  /** severity 的描述 */
    severity: low  medium  high  critical;
  message: string;
  timestamp: Date;
}

@Injectable()
export class NotificationService {
  constructor(private readonly config: ConfigService) {}

  async send(message: INotificationMessage): Promise<void> {
    // 实现通知发送逻辑
    console.log('Sending notification:', message);
  }
}
