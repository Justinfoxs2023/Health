export interface PushService {
  sendPushNotification(token: string, notification: PushNotification): Promise<void>;
}

export interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
} 