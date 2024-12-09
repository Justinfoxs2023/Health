import { Redis } from 'ioredis';
import { Logger } from '../../utils/logger';

// 导出所有服务类型
export * from './user.service';
export * from './auth.service';
export * from './profile.service';
export * from './notification.service';
export * from './permission.service';
export * from './security.service';
export * from './doctor.service';
export * from './advisor.service';
export * from './admin.service';
export * from './analytics.service';
export * from './content.service';
export * from './icon.service';
export * from './audit.service';
export * from './health-record.service';
export * from './ai.service';

// 基础服务接口
export interface BaseService {
  logger: Logger;
  redis: Redis;
}

// 导出所有工具类型
export * from '../utils/logger';
export * from '../utils/redis';
export * from '../utils/encryption';
export * from '../utils/validators';
export * from '../utils/errors'; 