import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';
import { RedisClient } from '../infrastructure/redis';
import { SystemSettings } from '../types/system-settings';
import { defaultSettings } from '../config/default-settings';
import { SystemSettingsValidator } from '../validators/system-settings.validator';

@injectable()
export class SystemSettingsService {
  private readonly SETTINGS_KEY = 'system:settings';

  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.Redis) private readonly redis: RedisClient
  ) {}

  async getSettings(): Promise<SystemSettings> {
    try {
      const settings = await this.redis.get(this.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : defaultSettings;
    } catch (error) {
      this.logger.error('获取系统设置失败', error);
      throw error;
    }
  }

  async updateSettings(updates: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = this.mergeSettings(currentSettings, updates);
      
      // 验证设置
      SystemSettingsValidator.validateSettings(updatedSettings);
      
      // 保存设置
      await this.redis.set(this.SETTINGS_KEY, JSON.stringify(updatedSettings));
      
      return updatedSettings;
    } catch (error) {
      this.logger.error('更新系统设置失败', error);
      throw error;
    }
  }

  private mergeSettings(current: SystemSettings, updates: Partial<SystemSettings>): SystemSettings {
    return {
      ...current,
      ...updates,
      security: {
        ...current.security,
        ...updates.security,
        passwordPolicy: {
          ...current.security.passwordPolicy,
          ...updates.security?.passwordPolicy
        }
      },
      notifications: {
        email: {
          ...current.notifications.email,
          ...updates.notifications?.email,
          templates: {
            ...current.notifications.email.templates,
            ...updates.notifications?.email?.templates
          }
        },
        push: {
          ...current.notifications.push,
          ...updates.notifications?.push,
          config: {
            ...current.notifications.push.config,
            ...updates.notifications?.push?.config
          }
        },
        sms: {
          ...current.notifications.sms,
          ...updates.notifications?.sms,
          templates: {
            ...current.notifications.sms.templates,
            ...updates.notifications?.sms?.templates
          }
        }
      },
      storage: {
        ...current.storage,
        ...updates.storage,
        compression: {
          ...current.storage.compression,
          ...updates.storage?.compression
        }
      },
      ai: {
        imageRecognition: {
          ...current.ai.imageRecognition,
          ...updates.ai?.imageRecognition
        },
        healthAssessment: {
          ...current.ai.healthAssessment,
          ...updates.ai?.healthAssessment,
          models: [...(current.ai.healthAssessment.models || []), ...(updates.ai?.healthAssessment?.models || [])]
        },
        recommendations: {
          ...current.ai.recommendations,
          ...updates.ai?.recommendations,
          weights: {
            ...current.ai.recommendations.weights,
            ...updates.ai?.recommendations?.weights
          }
        }
      },
      features: {
        ...current.features,
        ...updates.features,
        premium: {
          ...current.features.premium,
          ...updates.features?.premium,
          features: [...(current.features.premium.features || []), ...(updates.features?.premium?.features || [])]
        }
      }
    };
  }
} 