// 平台类型
export type PlatformType = 
  | 'wechat'    // 微信运动
  | 'apple'     // Apple Health
  | 'huawei'    // 华为运动健康
  | 'xiaomi'    // 小米运动
  | 'samsung'   // Samsung Health
  | 'google'    // Google Fit
  | 'fitbit'    // Fitbit
  | 'garmin';   // Garmin

// 平台配置
export interface PlatformConfig {
  platform: PlatformType;
  appId: string;
  appSecret: string;
  apiVersion: string;
  scopes: string[];
  redirectUri?: string;
}

// 授权信息
export interface AuthInfo {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string[];
  userId: string;
  platformUserId: string;
}

// 数据同步配置
export interface SyncConfig {
  platform: PlatformType;
  dataTypes: string[];
  startTime?: Date;
  endTime?: Date;
  incrementalSync?: boolean;
  batchSize?: number;
}

// 同步状态
export interface SyncStatus {
  platform: PlatformType;
  userId: string;
  lastSyncTime: Date;
  nextSyncTime?: Date;
  status: 'idle' | 'syncing' | 'error';
  error?: string;
  progress?: number;
} 