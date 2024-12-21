/**
 * @fileoverview TS 文件 system-config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 系统设置类型
export enum SystemConfigType {
  STORAGE = 'storage', // 存储配置
  AI = 'ai', // AI功能配置
  SECURITY = 'security', // 安全配置
  NOTIFICATION = 'notification', // 通知配置
  PERFORMANCE = 'performance', // 性能配置
  APPEARANCE = 'appearance', // 外观配置
  INTEGRATION = 'integration', // 第三方集成
}

// 系统配置基础接口
export interface IBaseConfig {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: import("D:/Health/src/types/system-config").SystemConfigType.STORAGE | import("D:/Health/src/types/system-config").SystemConfigType.AI | import("D:/Health/src/types/system-config").SystemConfigType.SECURITY | import("D:/Health/src/types/system-config").SystemConfigType.NOTIFICATION | import("D:/Health/src/types/system-config").SystemConfigType.PERFORMANCE | import("D:/Health/src/types/system-config").SystemConfigType.APPEARANCE | import("D:/Health/src/types/system-config").SystemConfigType.INTEGRATION;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** enabled 的描述 */
  enabled: false | true;
  /** lastUpdated 的描述 */
  lastUpdated: Date;
  /** updatedBy 的描述 */
  updatedBy: string;
}

// 安全配置
export interface ISecurityConfig extends IBaseConfig {
  /** passwordPolicy 的描述 */
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  /** sessionTimeout 的描述 */
  sessionTimeout: number;
  /** maxLoginAttempts 的描述 */
  maxLoginAttempts: number;
  /** twoFactorAuth 的描述 */
  twoFactorAuth: false | true;
  /** ipWhitelist 的描述 */
  ipWhitelist: string[];
}

// 通知配置
export interface INotificationConfig extends IBaseConfig {
  /** channels 的描述 */
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  /** templates 的描述 */
  templates: {
    [key: string]: {
      title: string;
      content: string;
      enabled: boolean;
    };
  };
  /** schedules 的描述 */
  schedules: {
    quietHours: {
      start: string;
      end: string;
    };
    timezone: string;
  };
}

// 性能配置
export interface IPerformanceConfig extends IBaseConfig {
  /** caching 的描述 */
  caching: {
    enabled: boolean;
    duration: number;
    maxSize: number;
  };
  /** optimization 的描述 */
  optimization: {
    imageCompression: boolean;
    lazyLoading: boolean;
    minification: boolean;
  };
  /** monitoring 的描述 */
  monitoring: {
    enabled: boolean;
    sampleRate: number;
    retentionDays: number;
  };
}
