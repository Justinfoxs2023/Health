export interface PerformanceConfig {
  metrics: {
    enabled: boolean;
    interval: number;
    retention: number;
  };
  alerts: {
    enabled: boolean;
    thresholds: {
      cpu: number;
      memory: number;
      latency: number;
      dbSlowThreshold: number;
      cacheHitRateThreshold: number;
    };
  };
  logging: {
    level: string;
    format: string;
  };
} 