import { AuditService } from '../services/audit.service';
import { ConfigManagerService } from '../services/config-manager.service';
import { Container } from 'inversify';
import { InitializationService } from '../services/initialization.service';
import { LoggerImpl } from '../infrastructure/logger';
import { RedisClientImpl } from '../infrastructure/redis';
import { SystemSettingsController } from '../controllers/system-settings.controller';
import { SystemSettingsService } from '../services/system-settings.service';
import { TYPES } from './types';

const container = new Container();

// 基础设施
container.bind(TYPES.Logger).to(LoggerImpl);
container.bind(TYPES.Redis).to(RedisClientImpl);

// 服务
container.bind(TYPES.SystemSettingsService).to(SystemSettingsService);
container.bind(TYPES.AuditService).to(AuditService);
container.bind(TYPES.ConfigManagerService).to(ConfigManagerService);
container.bind(TYPES.InitializationService).to(InitializationService);

// 控制器
container.bind(TYPES.SystemSettingsController).to(SystemSettingsController);

export { container };
