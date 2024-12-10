// 基础配置接口
export interface AppConfig {
  name: string;
  env: string;
  port: number;
  url: string;
  serviceName: string;
  serviceVersion: string;
}

// 数据库配置接口
export interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  authSource: string;
  replicaSet?: string;
  minPoolSize: number;
  maxPoolSize: number;
  connectTimeout: number;
}

// Redis配置接口
export interface RedisConfig {
  cluster: boolean;
  nodes?: string[];
  host?: string;
  port?: number;
  password: string;
  keyPrefix: string;
  ssl: boolean;
  retryTime: number;
  retryAttempts: number;
  retryInterval: number;
}

// JWT配置接口
export interface JwtConfig {
  secret: string;
  privateKey?: string;
  publicKey?: string;
  algorithm: string;
  expiresIn: string;
  refreshExpiresIn: string;
  blacklistEnabled: boolean;
  blacklistGracePeriod: number;
}

// 存储配置接口
export interface StorageConfig {
  driver: 'local' | 's3';
  aws?: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    endpoint?: string;
    ssl: boolean;
  };
  maxFileSize: number;
  allowedTypes: string[];
}

// 监控配置接口
export interface MonitoringConfig {
  enabled: boolean;
  sampleRate: number;
  metrics: boolean;
  metricsPrefix: string;
  sentry: {
    dsn: string;
    environment: string;
    tracesSampleRate: number;
  };
  logging: {
    level: string;
    channel: string;
    cloudwatch?: {
      group: string;
      stream: string;
    };
  };
}

// 安全配置接口
export interface SecurityConfig {
  securityKey: string;
  encryptionKey: string;
  apiRateLimit: number;
  apiRateWindow: number;
  allowedOrigins: string[];
  corsMaxAge: number;
  ddos: {
    enabled: boolean;
    maxRequests: number;
    timeWindow: number;
  };
  xss: boolean;
  sqlInjection: boolean;
  csrf: {
    enabled: boolean;
    tokenExpire: number;
  };
  secureHeaders: boolean;
}

// 集群配置接口
export interface ClusterConfig {
  enabled: boolean;
  name: string;
  size: number;
  syncInterval: number;
  heartbeatInterval: number;
}

// AI服务配置接口
export interface AiServiceConfig {
  serviceUrl: string;
  serviceKey: string;
  modelVersion: string;
  requestTimeout: number;
  maxRetries: number;
  batchSize: number;
  cacheTtl: number;
  resultExpiry: number;
  providers: {
    openai: {
      apiKey: string;
      orgId: string;
    };
    deepseek: {
      apiKey: string;
      apiBase: string;
    };
  };
}

// 环境配置验证规则
export const configValidationRules = {
  required: [
    'APP_NAME',
    'APP_ENV',
    'APP_PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'REDIS_HOST',
    'REDIS_PORT',
    'JWT_SECRET'
  ],
  
  // 数字类型验证
  number: {
    'APP_PORT': { min: 1, max: 65535 },
    'DB_PORT': { min: 1, max: 65535 },
    'REDIS_PORT': { min: 1, max: 65535 },
    'API_RATE_LIMIT': { min: 1 },
    'API_RATE_WINDOW': { min: 1 },
    'FILE_MAX_SIZE': { min: 1 },
    'CLUSTER_SIZE': { min: 1 },
    'AI_REQUEST_TIMEOUT': { min: 1000 }
  },

  // URL格式验证
  url: [
    'APP_URL',
    'AI_SERVICE_URL',
    'AWS_S3_ENDPOINT'
  ],

  // 枚举值验证
  enum: {
    'APP_ENV': ['development', 'production', 'test'],
    'LOG_LEVEL': ['error', 'warn', 'info', 'debug', 'trace'],
    'STORAGE_DRIVER': ['local', 's3']
  },

  // 布尔值验证
  boolean: [
    'DB_SSL',
    'REDIS_SSL',
    'MONITOR_ENABLED',
    'METRICS_ENABLED',
    'DDOS_PROTECTION_ENABLED',
    'XSS_PROTECTION_ENABLED',
    'SQL_INJECTION_PROTECTION',
    'CSRF_PROTECTION',
    'SECURE_HEADERS_ENABLED'
  ],

  // 正则表达式验证
  regex: {
    'APP_NAME': /^[\w\-\s]+$/,
    'SERVICE_VERSION': /^\d+\.\d+\.\d+$/,
    'JWT_EXPIRES_IN': /^\d+[hdwmy]$/
  },

  // 最小长度验证
  minLength: {
    'JWT_SECRET': 32,
    'SECURITY_KEY': 32,
    'ENCRYPTION_KEY': 32,
    'AWS_ACCESS_KEY_ID': 16,
    'AWS_SECRET_ACCESS_KEY': 32
  }
}; 