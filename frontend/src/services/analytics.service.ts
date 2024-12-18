import { api } from '../utils/api';

export interface IUserBehavior {
  /** userId 的描述 */
  userId: string;
  /** eventType 的描述 */
  eventType: string;
  /** eventData 的描述 */
  eventData: any;
  /** timestamp 的描述 */
  timestamp: Date;
  /** sessionId 的描述 */
  sessionId: string;
  /** pageUrl 的描述 */
  pageUrl: string;
}

export class AnalyticsService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  async trackEvent(eventType: string, eventData: any) {
    try {
      const behavior: Partial<IUserBehavior> = {
        eventType,
        eventData,
        timestamp: new Date(),
        sessionId: this.sessionId,
        pageUrl: window.location.href,
      };

      await api.post('/api/analytics/track', behavior);
    } catch (error) {
      console.error('Error in analytics.service.ts:', '记录用户行为失败:', error);
    }
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
