declare module 'analytics' {
  export interface AnalyticsConfig {
    enabled: boolean;
    trackingId?: string;
    options?: Record<string, any>;
  }
} 