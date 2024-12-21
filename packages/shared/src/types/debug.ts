/**
 * @fileoverview TS 文件 debug.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export interface IDebugConfig {
  /** debug 的描述 */
  debug: {
    enabled: boolean;
    verboseLogging: boolean;
    breakOnError: boolean;
    showDevTools: boolean;
  };
  /** logging 的描述 */
  logging: {
    level: LogLevel;
    console: {
      enabled: boolean;
      colorized: boolean;
      timestamp: boolean;
    };
    file: {
      enabled: boolean;
      path: string;
      maxSize: string;
      maxFiles: number;
    };
    performance: {
      enabled: boolean;
      slowQueryThreshold: number;
      memoryWarningThreshold: number;
    };
  };
  /** api 的描述 */
  api: {
    mockEnabled: boolean;
    delay: number;
    errorRate: number;
  };
  /** monitoring 的描述 */
  monitoring: {
    enabled: boolean;
    metrics: {
      cpu: boolean;
      memory: boolean;
      requests: boolean;
      responses: boolean;
      errors: boolean;
    };
    sampling: {
      rate: number;
      interval: number;
    };
  };
  /** devTools 的描述 */
  devTools: {
    redux: {
      enabled: boolean;
      maxAge: number;
    };
    network: {
      enabled: boolean;
      includeHeaders: boolean;
      includeBodies: boolean;
      maxBodySize: number;
    };
    components: {
      enabled: boolean;
      highlightUpdates: boolean;
    };
  };
  /** errorTracking 的描述 */
  errorTracking: {
    enabled: boolean;
    captureUnhandledRejections: boolean;
    captureUncaughtExceptions: boolean;
    ignorePatterns: RegExp[];
    breadcrumbs: {
      enabled: boolean;
      maxBreadcrumbs: number;
    };
  };
  /** profiling 的描述 */
  profiling: {
    enabled: boolean;
    flamegraph: {
      enabled: boolean;
      samplingInterval: number;
    };
    memoryHeapSnapshots: {
      enabled: boolean;
      maxSnapshots: number;
    };
  };
}
