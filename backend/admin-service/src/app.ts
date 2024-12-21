import 'reflect-metadata';
import { ConfigManagerService } from './services/config-manager.service';
import { Container } from 'inversify';
import { InitializationService } from './services/initialization.service';
import { LoggerImpl } from './infrastructure/logger';
import { RedisClientImpl } from './infrastructure/redis';
import { SystemSettingsService } from './services/system-settings.service';
import { TYPES } from './di/types';

const container = new Container();

// 注册服务
container.bind(TYPES.Logger).to(LoggerImpl);
container.bind(TYPES.Redis).to(RedisClientImpl);
container.bind(TYPES.SystemSettings).to(SystemSettingsService);
container.bind(TYPES.ConfigManager).to(ConfigManagerService);
container.bind(TYPES.InitializationService).to(InitializationService);

export { container };
