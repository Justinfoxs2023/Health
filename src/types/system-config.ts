// 系统设置类型
export enum SystemConfigType {
  STORAGE = 'storage',    // 存储配置
  AI = 'ai',             // AI功能配置
  SECURITY = 'security', // 安全配置
  NOTIFICATION = 'notification', // 通知配置
  PERFORMANCE = 'performance',   // 性能配置
  APPEARANCE = 'appearance',     // 外观配置
  INTEGRATION = 'integration'    // 第三方集成
}

// 系统配置基础接口
export interface BaseConfig {
  id: string;
  type: SystemConfigType;
  name: string;
  description: string;
  enabled: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

// 安全配置
export interface SecurityConfig extends BaseConfig {
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
  ipWhitelist: string[];
}

// 通知配置
export interface NotificationConfig extends BaseConfig {
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  templates: {
    [key: string]: {
      title: string;
      content: string;
      enabled: boolean;
    };
  };
  schedules: {
    quietHours: {
      start: string;
      end: string;
    };
    timezone: string;
  };
}

// 性能配置
export interface PerformanceConfig extends BaseConfig {
  caching: {
    enabled: boolean;
    duration: number;
    maxSize: number;
  };
  optimization: {
    imageCompression: boolean;
    lazyLoading: boolean;
    minification: boolean;
  };
  monitoring: {
    enabled: boolean;
    sampleRate: number;
    retentionDays: number;
  };
} 