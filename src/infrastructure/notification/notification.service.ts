import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

export interface NotificationMessage {
  type: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
}

@Injectable()
export class NotificationService {
  constructor(private readonly config: ConfigService) {}

  async send(message: NotificationMessage): Promise<void> {
    // 实现通知发送逻辑
    console.log('Sending notification:', message);
  }
} 