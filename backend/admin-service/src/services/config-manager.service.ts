import { EventEmitter } from 'events';
import { ILogger } from '../types/logger';
import { IRedisClient } from '../infrastructure/redis';
import { ISystemSettings } from '../types/system-settings';
import { TYPES } from '../di/types';
import { defaultSettings } from '../config/default-settings';
import { injectable, inject } from 'inversify';

@injectable()
export class ConfigManagerService {
  private readonly SETTINGS_KEY = 'system:settings';
  private configEvents = new EventEmitter();

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.Redis) private redis: IRedisClient,
  ) {
    this.initializeSettings();
  }

  private async initializeSettings() {
    try {
      const exists = await this.redis.exists(this.SETTINGS_KEY);
      if (!exists) {
        await this.redis.set(this.SETTINGS_KEY, JSON.stringify(defaultSettings));
        this.logger.info('系统设置初始化完成');
      }
    } catch (error) {
      this.logger.error('系统设置初始化失败', error);
    }
  }

  async getSettings<T extends keyof ISystemSettings>(
    section?: T,
  ): Promise<T extends keyof ISystemSettings ? ISystemSettings[T] : ISystemSettings> {
    try {
      const settings = await this.redis.get(this.SETTINGS_KEY);
      const parsedSettings = settings ? JSON.parse(settings) : defaultSettings;
      return section ? parsedSettings[section] : parsedSettings;
    } catch (error) {
      this.logger.error('获取系统设置失败', error);
      throw error;
    }
  }

  async updateSettings<T extends keyof ISystemSettings>(
    section: T,
    updates: Partial<ISystemSettings[T]>,
  ): Promise<ISystemSettings[T]> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        [section]: {
          ...currentSettings[section],
          ...updates,
        },
      };

      // 验证设置
      await this.validateSettings(section, updatedSettings[section]);

      // 保存设置
      await this.redis.set(this.SETTINGS_KEY, JSON.stringify(updatedSettings));

      // 触发配置更新事件
      this.configEvents.emit('configUpdated', {
        section,
        updates,
        timestamp: new Date(),
      });

      return updatedSettings[section];
    } catch (error) {
      this.logger.error('更新系统设置失败', error);
      throw error;
    }
  }

  onConfigUpdate(callback: (event: any) => void) {
    this.configEvents.on('configUpdated', callback);
  }

  private async validateSettings<T extends keyof ISystemSettings>(
    section: T,
    settings: ISystemSettings[T],
  ) {
    switch (section) {
      case 'security':
        this.validateSecuritySettings(settings as SecuritySettings);
        break;
      case 'notifications':
        await this.validateNotificationSettings(settings as NotificationSettings);
        break;
      // ... 其他部分的验证
    }
  }

  private validateSecuritySettings(settings: SecuritySettings) {
    const { passwordPolicy, sessionTimeout, tokenExpiry } = settings;

    if (passwordPolicy.minLength < 8) {
      throw new Error('密码最小长度不能小于8');
    }

    if (sessionTimeout < 300) {
      throw new Error('会话超时时间不能小于5分钟');
    }

    if (tokenExpiry.access < 300) {
      throw new Error('访问令牌过期时间不能小于5分钟');
    }
  }

  private async validateNotificationSettings(settings: NotificationSettings) {
    if (settings.email.enabled) {
      // 验证邮件服务配置
      await this.validateEmailConfig(settings.email);
    }

    if (settings.push.enabled) {
      // 验证推送服务配置
      await this.validatePushConfig(settings.push);
    }
  }

  private async validateEmailConfig(config: NotificationSettings['email']) {
    // 实现邮件配置验证逻辑
  }

  private async validatePushConfig(config: NotificationSettings['push']) {
    // 实现推送配置验证逻辑
  }
}
