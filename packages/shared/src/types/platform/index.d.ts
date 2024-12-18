/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 平台类型
export type PlatformType =
  | 'wechat' // 微信运动
  | 'apple' // Apple Health
  | 'huawei' // 华为运动健康
  | 'xiaomi' // 小米运动
  | 'samsung' // Samsung Health
  | 'google' // Google Fit
  | 'fitbit' // Fitbit
  | 'garmin'; // Garmin

// 平台配置
export interface IPlatformConfig {
  /** platform 的描述 */
  platform: PlatformType;
  /** appId 的描述 */
  appId: string;
  /** appSecret 的描述 */
  appSecret: string;
  /** apiVersion 的描述 */
  apiVersion: string;
  /** scopes 的描述 */
  scopes: string[];
  /** redirectUri 的描述 */
  redirectUri?: string;
}

// 授权信息
export interface IAuthInfo {
  /** accessToken 的描述 */
  accessToken: string;
  /** refreshToken 的描述 */
  refreshToken?: string;
  /** expiresIn 的描述 */
  expiresIn: number;
  /** scope 的描述 */
  scope: string[];
  /** userId 的描述 */
  userId: string;
  /** platformUserId 的描述 */
  platformUserId: string;
}

// 数据同步配置
export interface ISyncConfig {
  /** platform 的描述 */
  platform: PlatformType;
  /** dataTypes 的描述 */
  dataTypes: string[];
  /** startTime 的描述 */
  startTime?: Date;
  /** endTime 的描述 */
  endTime?: Date;
  /** incrementalSync 的描述 */
  incrementalSync?: boolean;
  /** batchSize 的描述 */
  batchSize?: number;
}

// 同步状态
export interface ISyncStatus {
  /** platform 的描述 */
  platform: PlatformType;
  /** userId 的描述 */
  userId: string;
  /** lastSyncTime 的描述 */
  lastSyncTime: Date;
  /** nextSyncTime 的描述 */
  nextSyncTime?: Date;
  /** status 的描述 */
  status: 'idle' | 'syncing' | 'error';
  /** error 的描述 */
  error?: string;
  /** progress 的描述 */
  progress?: number;
}
