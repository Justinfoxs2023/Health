import { api } from '../utils/api';

export interface UserBehavior {
  userId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  sessionId: string;
  pageUrl: string;
}

export class AnalyticsService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  async trackEvent(eventType: string, eventData: any) {
    try {
      const behavior: Partial<UserBehavior> = {
        eventType,
        eventData,
        timestamp: new Date(),
        sessionId: this.sessionId,
        pageUrl: window.location.href
      };

      await api.post('/api/analytics/track', behavior);
    } catch (error) {
      console.error('记录用户行为失败:', error);
    }
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 