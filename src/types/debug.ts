export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export interface DebugConfig {
  debug: {
    enabled: boolean;
    verboseLogging: boolean;
    breakOnError: boolean;
    showDevTools: boolean;
  };
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
  api: {
    mockEnabled: boolean;
    delay: number;
    errorRate: number;
  };
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