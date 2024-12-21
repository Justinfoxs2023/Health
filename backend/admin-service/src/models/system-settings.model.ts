/**
 * @fileoverview TS 文件 system-settings.model.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ISystemSettings {
  /** security 的描述 */
  security: {
    passwordPolicy: {
      minLength: number;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      requireUppercase: boolean;
      maxLoginAttempts: number;
    };
    sessionTimeout: number;
    tokenExpiry: {
      access: number;
      refresh: number;
    };
  };
  /** notifications 的描述 */
  notifications: {
    email: {
      enabled: boolean;
      provider: string;
      from: string;
    };
    push: {
      enabled: boolean;
      provider: string;
    };
  };
  /** features 的描述 */
  features: {
    socialLogin: {
      google: boolean;
      apple: boolean;
      wechat: boolean;
    };
    healthTracking: {
      steps: boolean;
      heartRate: boolean;
      sleep: boolean;
      nutrition: boolean;
    };
  };
}
