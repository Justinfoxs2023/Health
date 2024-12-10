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
    };
  };
  logging: {
    level: string;
    format: string;
  };
}

export interface MonitoringData {
  timestamp: Date;
  metrics: {
    cpu: number;
    memory: number;
    latency: number;
  };
  alerts: Alert[];
}

export interface Alert {
  id: string;
  level: string;
  message: string;
  timestamp: Date;
  data?: any;
} 