import { LogLevel } from '@nestjs/common';

export interface IDebugConfig {
  /** enabled 的描述 */
  enabled: boolean;
  /** logLevel 的描述 */
  logLevel: LogLevel;
  /** mongoDebug 的描述 */
  mongoDebug: boolean;
  /** stackTrace 的描述 */
  stackTrace: boolean;
}

export const debugConfig: IDebugConfig = {
  enabled: process.env.DEBUG === 'true',
  logLevel: (process.env.LOG_LEVEL as LogLevel) || 'debug',
  mongoDebug: process.env.MONGO_DEBUG === 'true',
  stackTrace: process.env.STACK_TRACE === 'true',
};

export const getDebugConfig = (): IDebugConfig => {
  return {
    ...debugConfig,
    // 根据环境变量动态调整配置
    enabled: process.env.NODE_ENV !== 'production' && debugConfig.enabled,
    mongoDebug: process.env.NODE_ENV !== 'production' && debugConfig.mongoDebug,
  };
};
