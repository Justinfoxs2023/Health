import { Injectable } from '@nestjs/common';

import {
  SystemConfigType,
  IBaseConfig,
  ISecurityConfig,
  INotificationConfig,
  IPerformanceConfig,
} from '@/types/system-config';
import { CacheService } from '@/services/cache/cache.service';
import { DatabaseService } from '@/services/database/database.service';
import { Logger } from '@/utils/logger';

@Injec
table()
export class SystemConfigService {
  private readonly CACHE_PREFIX = 'system_config:';

  constructor(
    private readonly db: DatabaseService,
    private readonly cache: CacheService,
    private readonly logger: Logger,
  ) {}

  // 获取配置
  async getConfig<T extends IBaseConfig>(type: SystemConfigType): Promise<T> {
    const cacheKey = `${this.CACHE_PREFIX}${type}`;

    // 尝试从缓存获取
    let config = await this.cache.get<T>(cacheKey);
    if (config) return config;

    // 从数据库获取
    config = await this.db.findOne('system_configs', { type });
    if (config) {
      await this.cache.set(cacheKey, config, 3600); // 1小时缓存
    }

    return config;
  }

  // 更新配置
  async updateConfig<T extends IBaseConfig>(
    type: SystemConfigType,
    config: Partial<T>,
  ): Promise<boolean> {
    try {
      const existing = await this.getConfig<T>(type);
      const updated = {
        ...existing,
        ...config,
        lastUpdated: new Date(),
      };

      // 保存到数据库
      await this.db.updateOne('system_configs', { type }, updated);

      // 更新缓存
      const cacheKey = `${this.CACHE_PREFIX}${type}`;
      await this.cache.set(cacheKey, updated);

      // 记录变更
      await this.logConfigChange(type, existing, updated);

      return true;
    } catch (error) {
      this.logger.error(`Failed to update config: ${error.message}`);
      throw error;
    }
  }

  // 验证配置
  async validateConfig<T extends IBaseConfig>(
    type: SystemConfigType,
    config: Partial<T>,
  ): Promise<boolean> {
    // 实现配置验证逻辑
    return true;
  }

  // 导出配置
  async exportConfig(types: SystemConfigType[]): Promise<object> {
    const configs = {};
    for (const type of types) {
      configs[type] = await this.getConfig(type);
    }
    return configs;
  }

  // 导入配置
  async importConfig(configs: object): Promise<boolean> {
    try {
      for (const [type, config] of Object.entries(configs)) {
        await this.updateConfig(type as SystemConfigType, config);
      }
      return true;
    } catch (error) {
      this.logger.error(`Failed to import configs: ${error.message}`);
      throw error;
    }
  }
}
