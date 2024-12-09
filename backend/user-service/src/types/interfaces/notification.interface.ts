export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'security_alert'
  | 'health_reminder'
  | 'appointment'
  | 'system';

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  types: {
    [key in NotificationType]: {
      enabled: boolean;
      channels: string[];
    };
  };
} 