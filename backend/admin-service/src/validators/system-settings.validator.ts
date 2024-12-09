import { SystemSettings } from '../types/system-settings';

export class SystemSettingsValidator {
  static validateSettings(settings: Partial<SystemSettings>): void {
    if (settings.security) {
      this.validateSecuritySettings(settings.security);
    }
    if (settings.notifications) {
      this.validateNotificationSettings(settings.notifications);
    }
    if (settings.features) {
      this.validateFeatureSettings(settings.features);
    }
  }

  private static validateSecuritySettings(security: Partial<SystemSettings['security']>): void {
    const { passwordPolicy, sessionTimeout, tokenExpiry } = security;

    if (passwordPolicy) {
      if (passwordPolicy.minLength < 8) {
        throw new Error('密码最小长度不能小于8');
      }
      if (passwordPolicy.maxLoginAttempts < 3) {
        throw new Error('最大登录尝试次数不能小于3');
      }
    }

    if (sessionTimeout && sessionTimeout < 300) {
      throw new Error('会话超时时间不能小于5分钟');
    }

    if (tokenExpiry) {
      if (tokenExpiry.access < 300) {
        throw new Error('访问令牌过期时间不能小于5分钟');
      }
      if (tokenExpiry.refresh < tokenExpiry.access) {
        throw new Error('刷新令牌过期时间不能小于访问令牌过期时间');
      }
    }
  }

  private static validateNotificationSettings(notifications: Partial<SystemSettings['notifications']>): void {
    const { email, push } = notifications;

    if (email?.enabled && !email.from) {
      throw new Error('启用邮件通知时必须设置发件人地址');
    }

    if (push?.enabled && !push.provider) {
      throw new Error('启用推送通知时必须设置推送服务提供商');
    }
  }

  private static validateFeatureSettings(features: Partial<SystemSettings['features']>): void {
    // 实现功能设置验证逻辑
  }
} 