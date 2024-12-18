import 'reflect-metadata';
import { AuditService } from './services/audit.service';
import { ConfigManagerService } from './services/config-manager.service';
import { Container } from 'inversify';
import { InitializationService } from './services/initialization.service';
import { LoggerImpl } from './infrastructure/logger';
import { RedisClientImpl } from './infrastructure/redis';
import { SystemSettingsService } from './services/system-settings.service';
import { TYPES } from './di/types';

export const container = new Container();

// 基础设施
container.bind(TYPES.Logger).to(LoggerImpl).inSingletonScope();
container.bind(TYPES.Redis).to(RedisClientImpl).inSingletonScope();

// 服务
container.bind(TYPES.SystemSettings).to(SystemSettingsService).inSingletonScope();
container.bind(TYPES.ConfigManager).to(ConfigManagerService).inSingletonScope();
container.bind(TYPES.InitializationService).to(InitializationService).inSingletonScope();
container.bind(TYPES.AuditService).to(AuditService).inSingletonScope();

export async function bootstrap(): Promise<void> {
  try {
    const initService = container.get<InitializationService>(TYPES.InitializationService);
    await initService.initialize();
  } catch (error) {
    console.error('Error in bootstrap:', error);
    throw error;
  }
}
