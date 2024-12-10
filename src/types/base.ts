// 基础类型定义
export interface Logger {
  error(message: string, error?: any): void;
  warn(message: string, data?: any): void;
  info(message: string, data?: any): void;
  debug(message: string, data?: any): void;
}

export interface Metrics {
  recordMetric(name: string, value: number): void;
  getMetric(name: string): number;
  incrementMetric(name: string): void;
  setMetric(name: string, value: number): void;
}

export interface AlertService {
  sendAlert(level: string, message: string, data?: any): Promise<void>;
  clearAlert(alertId: string): Promise<void>;
  getActiveAlerts(): Promise<Alert[]>;
} 