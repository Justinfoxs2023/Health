import { ConfigService as NestConfigService } from '@nestjs/config';
import { ErrorService } from '../error/error.service';
import { Injectable } from '@nestjs/common';
import { MetricsService } from '../monitoring/metrics.service';
import { RedisService } from '../cache/redis.service';

export interface IConfigChangeEvent {
  /** key 的描述 */
  key: string;
  /** oldValue 的描述 */
  oldValue: any;
  /** newValue 的描述 */
  newValue: any;
  /** timestamp 的描述 */
  timestamp: number;
}

@Injectable()
export class ConfigService {
  private readonly CACHE_KEY = 'config:';
  private readonly configCache = new Map<string, any>();
  private readonly configListeners = new Map<string, Function[]>();

  constructor(
    private readonly nestConfigService: NestConfigService,
    private readonly redisService: RedisService,
    private readonly metricsService: MetricsService,
    private readonly errorService: ErrorService,
  ) {
    this.initializeConfig();
  }

  /**
   * 初始化配置
   */
  private async initializeConfig(): Promise<void> {
    try {
      // 1. 加载环境变量配置
      const envConfig = this.loadEnvConfig();

      // 2. 加载Redis缓存的配置
      const cachedConfig = await this.loadCachedConfig();

      // 3. 合并配置
      const mergedConfig = {
        ...envConfig,
        ...cachedConfig,
      };

      // 4. 更新本地缓存
      Object.entries(mergedConfig).forEach(([key, value]) => {
        this.configCache.set(key, value);
      });

      // 5. 记录指标
      this.metricsService.recordCustomMetric('config_initialization', 1);
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'config',
        method: 'initializeConfig',
      });
    }
  }

  /**
   * 加载环境变量配置
   */
  private loadEnvConfig(): Record<string, any> {
    const config: Record<string, any> = {};

    // 从NestJS ConfigService获取环境变量
    const envVars = this.nestConfigService.get('env');
    if (envVars) {
      Object.entries(envVars).forEach(([key, value]) => {
        config[key] = value;
      });
    }

    return config;
  }

  /**
   * 加载缓存的配置
   */
  private async loadCachedConfig(): Promise<Record<string, any>> {
    try {
      const cachedConfig = await this.redisService.get<Record<string, any>>(`${this.CACHE_KEY}all`);
      return cachedConfig || {};
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'config',
        method: 'loadCachedConfig',
      });
      return {};
    }
  }

  /**
   * 获取配置值
   */
  get<T>(key: string, defaultValue?: T): T {
    try {
      // 1. 检查本地缓存
      if (this.configCache.has(key)) {
        return this.configCache.get(key);
      }

      // 2. 检查环境变量
      const envValue = this.nestConfigService.get<T>(key);
      if (envValue !== undefined) {
        this.configCache.set(key, envValue);
        return envValue;
      }

      // 3. 返回默认值
      return defaultValue;
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'config',
        method: 'get',
        params: { key },
      });
      return defaultValue;
    }
  }

  /**
   * 设置配置值
   */
  async set(key: string, value: any): Promise<void> {
    try {
      // 1. 获取旧值
      const oldValue = this.get(key);

      // 2. 更新本地缓存
      this.configCache.set(key, value);

      // 3. 更新Redis缓存
      await this.redisService.set(`${this.CACHE_KEY}${key}`, value);

      // 4. 触发配置变更事件
      this.notifyConfigChange({
        key,
        oldValue,
        newValue: value,
        timestamp: Date.now(),
      });

      // 5. 记录指标
      this.metricsService.recordCustomMetric('config_update', 1, { key });
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'config',
        method: 'set',
        params: { key, value },
      });
    }
  }

  /**
   * 删除配置
   */
  async delete(key: string): Promise<void> {
    try {
      // 1. 获取旧值
      const oldValue = this.get(key);

      // 2. 删除本地缓存
      this.configCache.delete(key);

      // 3. 删除Redis缓存
      await this.redisService.delete(`${this.CACHE_KEY}${key}`);

      // 4. 触发配置变更事件
      this.notifyConfigChange({
        key,
        oldValue,
        newValue: undefined,
        timestamp: Date.now(),
      });

      // 5. 记录指标
      this.metricsService.recordCustomMetric('config_delete', 1, { key });
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'config',
        method: 'delete',
        params: { key },
      });
    }
  }

  /**
   * 监听配置变更
   */
  onConfigChange(key: string, listener: (event: IConfigChangeEvent) => void): () => void {
    const listeners = this.configListeners.get(key) || [];
    listeners.push(listener);
    this.configListeners.set(key, listeners);

    // 返回取消监听函数
    return () => {
      const currentListeners = this.configListeners.get(key) || [];
      const index = currentListeners.indexOf(listener);
      if (index > -1) {
        currentListeners.splice(index, 1);
        if (currentListeners.length === 0) {
          this.configListeners.delete(key);
        } else {
          this.configListeners.set(key, currentListeners);
        }
      }
    };
  }

  /**
   * 通知配置变更
   */
  private notifyConfigChange(event: IConfigChangeEvent): void {
    const listeners = this.configListeners.get(event.key) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        this.errorService.handleError(error, {
          service: 'config',
          method: 'notifyConfigChange',
          params: event,
        });
      }
    });
  }

  /**
   * 获取所有配置
   */
  getAll(): Record<string, any> {
    return Object.fromEntries(this.configCache);
  }

  /**
   * 重置配置
   */
  async reset(): Promise<void> {
    try {
      // 1. 清空本地缓存
      this.configCache.clear();

      // 2. 清空Redis缓存
      await this.redisService.delete(`${this.CACHE_KEY}*`);

      // 3. 重新初始化
      await this.initializeConfig();

      // 4. 记录指标
      this.metricsService.recordCustomMetric('config_reset', 1);
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'config',
        method: 'reset',
      });
    }
  }

  /**
   * 导出配置
   */
  async export(): Promise<string> {
    try {
      const config = this.getAll();
      return JSON.stringify(config, null, 2);
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'config',
        method: 'export',
      });
      return '{}';
    }
  }

  /**
   * 导入配置
   */
  async import(configStr: string): Promise<void> {
    try {
      const config = JSON.parse(configStr);
      for (const [key, value] of Object.entries(config)) {
        await this.set(key, value);
      }
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'config',
        method: 'import',
        params: { configStr },
      });
    }
  }
}
