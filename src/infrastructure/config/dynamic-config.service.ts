import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Logger } from '../logger/logger.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface ConfigChangeEvent {
  key: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}

@Injectable()
export class DynamicConfigService implements OnModuleInit {
  private configCache: Map<string, any> = new Map();
  private readonly logger = new Logger(DynamicConfigService.name);
  private readonly refreshInterval: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.refreshInterval = parseInt(configService.get('CONFIG_REFRESH_INTERVAL') || '30000');
  }

  async onModuleInit() {
    await this.loadAllConfigs();
    this.startRefreshTimer();
  }

  private async loadAllConfigs() {
    try {
      // 从配置中心加载配置
      const configs = await this.fetchConfigs();
      for (const [key, value] of Object.entries(configs)) {
        const oldValue = this.configCache.get(key);
        if (oldValue !== value) {
          this.configCache.set(key, value);
          this.emitChangeEvent(key, oldValue, value);
        }
      }
    } catch (error) {
      this.logger.error('Failed to load configs:', error);
    }
  }

  private async fetchConfigs(): Promise<Record<string, any>> {
    // 实现从配置中心获取配置的逻辑
    return {};
  }

  private startRefreshTimer() {
    setInterval(() => {
      this.loadAllConfigs().catch(error => {
        this.logger.error('Failed to refresh configs:', error);
      });
    }, this.refreshInterval);
  }

  private emitChangeEvent(key: string, oldValue: any, newValue: any) {
    const event: ConfigChangeEvent = {
      key,
      oldValue,
      newValue,
      timestamp: new Date()
    };
    this.eventEmitter.emit('config.changed', event);
    this.logger.log(`Config changed: ${key}`);
  }

  get<T>(key: string, defaultValue?: T): T {
    return this.configCache.get(key) ?? defaultValue;
  }

  async set(key: string, value: any): Promise<void> {
    const oldValue = this.configCache.get(key);
    this.configCache.set(key, value);
    this.emitChangeEvent(key, oldValue, value);
    // 实现持久化到配置中心的逻辑
  }

  watch(key: string, callback: (event: ConfigChangeEvent) => void): void {
    this.eventEmitter.on('config.changed', (event: ConfigChangeEvent) => {
      if (event.key === key) {
        callback(event);
      }
    });
  }
} 