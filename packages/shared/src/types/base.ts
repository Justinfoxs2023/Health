/**
 * @fileoverview TS 文件 base.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 基础类型定义
export interface ILogger {
  error(message: string, error?: any): void;
  warn(message: string, data?: any): void;
  info(message: string, data?: any): void;
  debug(message: string, data?: any): void;
}

export interface IMetrics {
  recordMetric(name: string, value: number): void;
  getMetric(name: string): number;
  incrementMetric(name: string): void;
  setMetric(name: string, value: number): void;
}

export interface IAlertService {
  sendAlert(level: string, message: string, data?: any): Promise<void>;
  clearAlert(alertId: string): Promise<void>;
  getActiveAlerts(): Promise<Alert[]>;
}

export interface IHealthData {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: HealthDataType;
  /** value 的描述 */
  value: number;
  /** timestamp 的描述 */
  timestamp: Date;
  /** userId 的描述 */
  userId: string;
}

export enum HealthDataType {
  BLOOD_PRESSURE = 'blood_pressure',
  HEART_RATE = 'heart_rate',
  BLOOD_SUGAR = 'blood_sugar',
  BODY_TEMPERATURE = 'body_temperature',
  WEIGHT = 'weight',
  HEIGHT = 'height',
  STEPS = 'steps',
}

export interface ICacheOptions {
  /** ttl 的描述 */
  ttl?: number;
  /** maxSize 的描述 */
  maxSize?: number;
  /** maxAge 的描述 */
  maxAge?: number;
}

export interface ICacheEntry<T> {
  /** data 的描述 */
  data: T;
  /** createdAt 的描述 */
  createdAt: number;
  /** lastAccessed 的描述 */
  lastAccessed: number;
  /** accessCount 的描述 */
  accessCount: number;
  /** expireAt 的描述 */
  expireAt?: number;
}
