import 'reflect-metadata';
import { ConfigManagerService } from './config-manager.service';
import { ILogger } from '../types/logger';
import { SystemSettingsService } from './system-settings.service';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class InitializationService {
  constructor(
    @inject(TYPES.Logger) private readonly logger: ILogger,
    @inject(TYPES.ConfigManager) private readonly configManager: ConfigManagerService,
    @inject(TYPES.SystemSettings) private readonly systemSettings: SystemSettingsService,
  ) {}

  async initialize() {
    try {
      this.logger.info('开始系统初始化...');

      // 初始化配置
      await this.initializeConfig();

      // 初始化系统设置
      await this.initializeSystemSettings();

      // 注册配置更新监听器
      this.registerConfigListeners();

      this.logger.info('系统初始化完成');
    } catch (error) {
      this.logger.error('系统初始化失败', error);
      throw error;
    }
  }

  private async initializeConfig() {
    // 实现配置初始化逻辑
  }

  private async initializeSystemSettings() {
    // 实现系统设置初始化逻辑
  }

  private registerConfigListeners() {
    this.configManager.onConfigUpdate(async event => {
      this.logger.info('配置更新', event);
      // 处理配置更新事件
    });
  }
}
