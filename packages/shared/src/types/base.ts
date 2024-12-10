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

export interface IHealthData {
  id: string;
  type: HealthDataType;
  value: number;
  timestamp: Date;
  userId: string;
}

export enum HealthDataType {
  BLOOD_PRESSURE = 'blood_pressure',
  HEART_RATE = 'heart_rate',
  BLOOD_SUGAR = 'blood_sugar',
  BODY_TEMPERATURE = 'body_temperature',
  WEIGHT = 'weight',
  HEIGHT = 'height',
  STEPS = 'steps'
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  maxAge?: number;
}

export interface CacheEntry<T> {
  data: T;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  expireAt?: number;
} 