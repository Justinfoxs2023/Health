/**
 * @fileoverview TS 文件 system-settings.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ISystemSettings {
  /** security 的描述 */
  security: ISecuritySettings;
  /** notifications 的描述 */
  notifications: INotificationSettings;
  /** features 的描述 */
  features: IFeatureSettings;
  /** monitoring 的描述 */
  monitoring: IMonitoringSettings;
  /** storage 的描述 */
  storage: IStorageSettings;
  /** ai 的描述 */
  ai: IAISettings;
}

export interface ISecuritySettings {
  /** passwordPolicy 的描述 */
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    requireUppercase: boolean;
    maxLoginAttempts: number;
  };
  /** sessionTimeout 的描述 */
  sessionTimeout: number;
  /** tokenExpiry 的描述 */
  tokenExpiry: {
    access: number;
    refresh: number;
  };
  /** ipWhitelist 的描述 */
  ipWhitelist: string[];
}

export interface INotificationSettings {
  /** email 的描述 */
  email: {
    enabled: boolean;
    provider: string;
    from: string;
    templates: Record<string, string>;
  };
  /** push 的描述 */
  push: {
    enabled: boolean;
    provider: string;
    config: Record<string, any>;
  };
  /** sms 的描述 */
  sms: {
    enabled: boolean;
    provider: string;
    templates: Record<string, string>;
  };
}

export interface IFeatureSettings {
  /** socialLogin 的描述 */
  socialLogin: {
    google: boolean;
    apple: boolean;
    wechat: boolean;
  };
  /** healthTracking 的描述 */
  healthTracking: {
    steps: boolean;
    heartRate: boolean;
    sleep: boolean;
    nutrition: boolean;
  };
  /** premium 的描述 */
  premium: {
    enabled: boolean;
    features: string[];
  };
}

export interface IMonitoringSettings {
  /** performance 的描述 */
  performance: {
    enabled: boolean;
    sampleRate: number;
    errorThreshold: number;
  };
  /** health 的描述 */
  health: {
    enabled: boolean;
    checkInterval: number;
    endpoints: string[];
  };
  /** alerts 的描述 */
  alerts: {
    channels: string[];
    thresholds: Record<string, number>;
  };
}

export interface IStorageSettings {
  /** provider 的描述 */
  provider: string;
  /** region 的描述 */
  region: string;
  /** bucket 的描述 */
  bucket: string;
  /** maxFileSize 的描述 */
  maxFileSize: number;
  /** allowedTypes 的描述 */
  allowedTypes: string[];
  /** compression 的描述 */
  compression: {
    enabled: boolean;
    quality: number;
  };
}

export interface IAISettings {
  /** imageRecognition 的描述 */
  imageRecognition: {
    enabled: boolean;
    provider: string;
    minConfidence: number;
  };
  /** healthAssessment 的描述 */
  healthAssessment: {
    enabled: boolean;
    updateFrequency: string;
    models: string[];
  };
  /** recommendations 的描述 */
  recommendations: {
    enabled: boolean;
    algorithms: string[];
    weights: Record<string, number>;
  };
}
