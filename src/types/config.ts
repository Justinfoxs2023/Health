/**
 * @fileoverview TS 文件 config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 基础配置接口
export interface IAppConfig {
  /** name 的描述 */
  name: string;
  /** env 的描述 */
  env: string;
  /** port 的描述 */
  port: number;
  /** url 的描述 */
  url: string;
  /** serviceName 的描述 */
  serviceName: string;
  /** serviceVersion 的描述 */
  serviceVersion: string;
}

// 数据库配置接口
export interface IDatabaseConfig {
  /** type 的描述 */
  type: string;
  /** host 的描述 */
  host: string;
  /** port 的描述 */
  port: number;
  /** database 的描述 */
  database: string;
  /** username 的描述 */
  username: string;
  /** password 的描述 */
  password: string;
  /** ssl 的描述 */
  ssl: false | true;
  /** authSource 的描述 */
  authSource: string;
  /** replicaSet 的描述 */
  replicaSet: string;
  /** minPoolSize 的描述 */
  minPoolSize: number;
  /** maxPoolSize 的描述 */
  maxPoolSize: number;
  /** connectTimeout 的描述 */
  connectTimeout: number;
}

// Redis配置接口
export interface IRedisConfig {
  /** cluster 的描述 */
  cluster: false | true;
  /** nodes 的描述 */
  nodes: string;
  /** host 的描述 */
  host: string;
  /** port 的描述 */
  port: number;
  /** password 的描述 */
  password: string;
  /** keyPrefix 的描述 */
  keyPrefix: string;
  /** ssl 的描述 */
  ssl: false | true;
  /** retryTime 的描述 */
  retryTime: number;
  /** retryAttempts 的描述 */
  retryAttempts: number;
  /** retryInterval 的描述 */
  retryInterval: number;
}

// JWT配置接口
export interface IJwtConfig {
  /** secret 的描述 */
  secret: string;
  /** privateKey 的描述 */
  privateKey: string;
  /** publicKey 的描述 */
  publicKey: string;
  /** algorithm 的描述 */
  algorithm: string;
  /** expiresIn 的描述 */
  expiresIn: string;
  /** refreshExpiresIn 的描述 */
  refreshExpiresIn: string;
  /** blacklistEnabled 的描述 */
  blacklistEnabled: false | true;
  /** blacklistGracePeriod 的描述 */
  blacklistGracePeriod: number;
}

// 存储配置接口
export interface IStorageConfig {
  /** driver 的描述 */
  driver: local /** s3 的描述 */;
  /** s3 的描述 */
  s3;
  /** aws 的描述 */
  aws: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    endpoint: string;
    ssl: boolean;
  };
  /** maxFileSize 的描述 */
  maxFileSize: number;
  /** allowedTypes 的描述 */
  allowedTypes: string[];
}

// 监控配置接口
export interface IMonitoringConfig {
  /** enabled 的描述 */
  enabled: false | true;
  /** sampleRate 的描述 */
  sampleRate: number;
  /** metrics 的描述 */
  metrics: false | true;
  /** metricsPrefix 的描述 */
  metricsPrefix: string;
  /** sentry 的描述 */
  sentry: {
    dsn: string;
    environment: string;
    tracesSampleRate: number;
  };
  /** logging 的描述 */
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
export interface ISecurityConfig {
  /** securityKey 的描述 */
  securityKey: string;
  /** encryptionKey 的描述 */
  encryptionKey: string;
  /** apiRateLimit 的描述 */
  apiRateLimit: number;
  /** apiRateWindow 的描述 */
  apiRateWindow: number;
  /** allowedOrigins 的描述 */
  allowedOrigins: string;
  /** corsMaxAge 的描述 */
  corsMaxAge: number;
  /** ddos 的描述 */
  ddos: {
    enabled: boolean;
    maxRequests: number;
    timeWindow: number;
  };
  /** xss 的描述 */
  xss: false | true;
  /** sqlInjection 的描述 */
  sqlInjection: false | true;
  /** csrf 的描述 */
  csrf: {
    enabled: boolean;
    tokenExpire: number;
  };
  /** secureHeaders 的描述 */
  secureHeaders: false | true;
}

// 集群配置接口
export interface IClusterConfig {
  /** enabled 的描述 */
  enabled: false | true;
  /** name 的描述 */
  name: string;
  /** size 的描述 */
  size: number;
  /** syncInterval 的描述 */
  syncInterval: number;
  /** heartbeatInterval 的描述 */
  heartbeatInterval: number;
}

// AI服务配置接口
export interface IAiServiceConfig {
  /** serviceUrl 的描述 */
  serviceUrl: string;
  /** serviceKey 的描述 */
  serviceKey: string;
  /** modelVersion 的描述 */
  modelVersion: string;
  /** requestTimeout 的描述 */
  requestTimeout: number;
  /** maxRetries 的描述 */
  maxRetries: number;
  /** batchSize 的描述 */
  batchSize: number;
  /** cacheTtl 的描述 */
  cacheTtl: number;
  /** resultExpiry 的描述 */
  resultExpiry: number;
  /** providers 的描述 */
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
    'JWT_SECRET',
  ],

  // 数字类型验证
  number: {
    APP_PORT: { min: 1, max: 65535 },
    DB_PORT: { min: 1, max: 65535 },
    REDIS_PORT: { min: 1, max: 65535 },
    API_RATE_LIMIT: { min: 1 },
    API_RATE_WINDOW: { min: 1 },
    FILE_MAX_SIZE: { min: 1 },
    CLUSTER_SIZE: { min: 1 },
    AI_REQUEST_TIMEOUT: { min: 1000 },
  },

  // URL格式验证
  url: ['APP_URL', 'AI_SERVICE_URL', 'AWS_S3_ENDPOINT'],

  // 枚举值验证
  enum: {
    APP_ENV: ['development', 'production', 'test'],
    LOG_LEVEL: ['error', 'warn', 'info', 'debug', 'trace'],
    STORAGE_DRIVER: ['local', 's3'],
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
    'SECURE_HEADERS_ENABLED',
  ],

  // 正则表达式验证
  regex: {
    APP_NAME: /^[\w\-\s]+$/,
    SERVICE_VERSION: /^\d+\.\d+\.\d+$/,
    JWT_EXPIRES_IN: /^\d+[hdwmy]$/,
  },

  // 最小长度验证
  minLength: {
    JWT_SECRET: 32,
    SECURITY_KEY: 32,
    ENCRYPTION_KEY: 32,
    AWS_ACCESS_KEY_ID: 16,
    AWS_SECRET_ACCESS_KEY: 32,
  },
};
