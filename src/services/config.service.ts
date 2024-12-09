import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import {
  AppConfig,
  DatabaseConfig,
  RedisConfig,
  JwtConfig,
  StorageConfig,
  MonitoringConfig,
  SecurityConfig,
  ClusterConfig,
  AiServiceConfig,
  configValidationRules
} from '../types/config';

@Injectable()
export class ConfigService {
  private config: { [key: string]: any } = {};
  private readonly environment: string;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.loadEnvironmentConfig();
    this.validateConfig();
  }

  // 加载环境配置
  private loadEnvironmentConfig() {
    try {
      // 基础配置
      const baseEnvPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(baseEnvPath)) {
        const baseConfig = dotenv.parse(fs.readFileSync(baseEnvPath));
        this.config = { ...this.config, ...baseConfig };
      }

      // 环境特定配置
      const envPath = path.resolve(process.cwd(), `.env.${this.environment}`);
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        this.config = { ...this.config, ...envConfig };
      }

      // 本地开发配置（不提交到版本控制）
      const localEnvPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(localEnvPath)) {
        const localConfig = dotenv.parse(fs.readFileSync(localEnvPath));
        this.config = { ...this.config, ...localConfig };
      }
    } catch (error) {
      console.error('Error loading environment config:', error);
      throw error;
    }
  }

  // 验证配置
  private validateConfig() {
    // 验证必需的配置项
    const missingRequired = configValidationRules.required.filter(
      key => !this.get(key)
    );
    if (missingRequired.length) {
      throw new Error(
        `Missing required configuration: ${missingRequired.join(', ')}`
      );
    }

    // 验证数字类型
    Object.entries(configValidationRules.number).forEach(([key, rules]) => {
      const value = this.getNumber(key);
      if (value !== null) {
        if (rules.min !== undefined && value < rules.min) {
          throw new Error(`${key} must be greater than or equal to ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          throw new Error(`${key} must be less than or equal to ${rules.max}`);
        }
      }
    });

    // 验证URL格式
    configValidationRules.url.forEach(key => {
      const value = this.get(key);
      if (value) {
        try {
          new URL(value);
        } catch {
          throw new Error(`Invalid URL format for ${key}`);
        }
      }
    });

    // 验证枚举值
    Object.entries(configValidationRules.enum).forEach(([key, values]) => {
      const value = this.get(key);
      if (value && !values.includes(value)) {
        throw new Error(`${key} must be one of: ${values.join(', ')}`);
      }
    });

    // 验证布尔值
    configValidationRules.boolean.forEach(key => {
      const value = this.get(key);
      if (value && !['true', 'false'].includes(value.toLowerCase())) {
        throw new Error(`${key} must be a boolean value`);
      }
    });

    // 验证正则表达式
    Object.entries(configValidationRules.regex).forEach(([key, pattern]) => {
      const value = this.get(key);
      if (value && !pattern.test(value)) {
        throw new Error(`Invalid format for ${key}`);
      }
    });

    // 验证最小长度
    Object.entries(configValidationRules.minLength).forEach(([key, length]) => {
      const value = this.get(key);
      if (value && value.length < length) {
        throw new Error(`${key} must be at least ${length} characters long`);
      }
    });
  }

  // 获取配置值
  get(key: string): string {
    return this.config[key] || process.env[key];
  }

  // 获取数字类型配置值
  getNumber(key: string): number {
    const value = this.get(key);
    return value ? parseInt(value, 10) : null;
  }

  // 获取布尔类型配置值
  getBoolean(key: string): boolean {
    const value = this.get(key);
    return value ? value.toLowerCase() === 'true' : false;
  }

  // 获取数组类型配置值
  getArray(key: string): string[] {
    const value = this.get(key);
    return value ? value.split(',').map(item => item.trim()) : [];
  }

  // 获取JSON类型配置值
  getJson(key: string): any {
    const value = this.get(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  // 获取当前环境
  getEnvironment(): string {
    return this.environment;
  }

  // 是否是生产环境
  isProduction(): boolean {
    return this.environment === 'production';
  }

  // 是否是开发环境
  isDevelopment(): boolean {
    return this.environment === 'development';
  }

  // 是否是测试环境
  isTest(): boolean {
    return this.environment === 'test';
  }

  // 获取应用配置
  getAppConfig(): AppConfig {
    return {
      name: this.get('APP_NAME'),
      env: this.get('APP_ENV'),
      port: this.getNumber('APP_PORT'),
      url: this.get('APP_URL'),
      serviceName: this.get('SERVICE_NAME'),
      serviceVersion: this.get('SERVICE_VERSION')
    };
  }

  // 获取数据库配置
  getDatabaseConfig(): DatabaseConfig {
    return {
      type: this.get('DB_TYPE'),
      host: this.get('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      database: this.get('DB_NAME'),
      username: this.get('DB_USER'),
      password: this.get('DB_PASS'),
      ssl: this.getBoolean('DB_SSL'),
      authSource: this.get('DB_AUTH_SOURCE'),
      replicaSet: this.get('DB_REPLICA_SET'),
      minPoolSize: this.getNumber('DB_MIN_POOL_SIZE'),
      maxPoolSize: this.getNumber('DB_MAX_POOL_SIZE'),
      connectTimeout: this.getNumber('DB_CONNECT_TIMEOUT')
    };
  }

  // 获取Redis配置
  getRedisConfig(): RedisConfig {
    return {
      cluster: this.getBoolean('REDIS_CLUSTER_ENABLED'),
      nodes: this.getArray('REDIS_NODES'),
      host: this.get('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
      password: this.get('REDIS_PASSWORD'),
      keyPrefix: this.get('REDIS_KEY_PREFIX'),
      ssl: this.getBoolean('REDIS_SSL'),
      retryTime: this.getNumber('REDIS_RETRY_TIME'),
      retryAttempts: this.getNumber('REDIS_RETRY_ATTEMPT_LIMIT'),
      retryInterval: this.getNumber('REDIS_RETRY_INTERVAL')
    };
  }

  // 获取JWT配置
  getJwtConfig(): JwtConfig {
    return {
      secret: this.get('JWT_SECRET'),
      privateKey: this.get('JWT_PRIVATE_KEY'),
      publicKey: this.get('JWT_PUBLIC_KEY'),
      algorithm: this.get('JWT_ALGORITHM'),
      expiresIn: this.get('JWT_EXPIRES_IN'),
      refreshExpiresIn: this.get('JWT_REFRESH_EXPIRES_IN'),
      blacklistEnabled: this.getBoolean('JWT_BLACKLIST_ENABLED'),
      blacklistGracePeriod: this.getNumber('JWT_BLACKLIST_GRACE_PERIOD')
    };
  }

  // 获取存储配置
  getStorageConfig(): StorageConfig {
    return {
      driver: this.get('STORAGE_DRIVER') as 'local' | 's3',
      aws: {
        region: this.get('AWS_REGION'),
        accessKeyId: this.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.get('AWS_SECRET_ACCESS_KEY'),
        bucket: this.get('AWS_S3_BUCKET'),
        endpoint: this.get('AWS_S3_ENDPOINT'),
        ssl: this.getBoolean('AWS_S3_SSL')
      },
      maxFileSize: this.getNumber('FILE_MAX_SIZE'),
      allowedTypes: this.getArray('ALLOWED_FILE_TYPES')
    };
  }

  // 获取监控配置
  getMonitoringConfig(): MonitoringConfig {
    return {
      enabled: this.getBoolean('MONITOR_ENABLED'),
      sampleRate: this.getNumber('MONITOR_SAMPLE_RATE'),
      metrics: this.getBoolean('METRICS_ENABLED'),
      metricsPrefix: this.get('METRICS_PREFIX'),
      sentry: {
        dsn: this.get('SENTRY_DSN'),
        environment: this.get('SENTRY_ENVIRONMENT'),
        tracesSampleRate: this.getNumber('SENTRY_TRACES_SAMPLE_RATE')
      },
      logging: {
        level: this.get('LOG_LEVEL'),
        channel: this.get('LOG_CHANNEL'),
        cloudwatch: {
          group: this.get('AWS_CLOUDWATCH_GROUP'),
          stream: this.get('AWS_CLOUDWATCH_STREAM')
        }
      }
    };
  }

  // 获取安全配置
  getSecurityConfig(): SecurityConfig {
    return {
      securityKey: this.get('SECURITY_KEY'),
      encryptionKey: this.get('ENCRYPTION_KEY'),
      apiRateLimit: this.getNumber('API_RATE_LIMIT'),
      apiRateWindow: this.getNumber('API_RATE_WINDOW'),
      allowedOrigins: this.getArray('ALLOWED_ORIGINS'),
      corsMaxAge: this.getNumber('CORS_MAX_AGE'),
      ddos: {
        enabled: this.getBoolean('DDOS_PROTECTION_ENABLED'),
        maxRequests: this.getNumber('DDOS_MAX_REQUESTS'),
        timeWindow: this.getNumber('DDOS_TIME_WINDOW')
      },
      xss: this.getBoolean('XSS_PROTECTION_ENABLED'),
      sqlInjection: this.getBoolean('SQL_INJECTION_PROTECTION'),
      csrf: {
        enabled: this.getBoolean('CSRF_PROTECTION'),
        tokenExpire: this.getNumber('CSRF_TOKEN_EXPIRE')
      },
      secureHeaders: this.getBoolean('SECURE_HEADERS_ENABLED')
    };
  }

  // 获取集群配置
  getClusterConfig(): ClusterConfig {
    return {
      enabled: this.getBoolean('CLUSTER_ENABLED'),
      name: this.get('CLUSTER_NAME'),
      size: this.getNumber('CLUSTER_SIZE'),
      syncInterval: this.getNumber('CLUSTER_SYNC_INTERVAL'),
      heartbeatInterval: this.getNumber('CLUSTER_HEARTBEAT_INTERVAL')
    };
  }

  // 获取AI服务配置
  getAiServiceConfig(): AiServiceConfig {
    return {
      serviceUrl: this.get('AI_SERVICE_URL'),
      serviceKey: this.get('AI_SERVICE_KEY'),
      modelVersion: this.get('AI_MODEL_VERSION'),
      requestTimeout: this.getNumber('AI_REQUEST_TIMEOUT'),
      maxRetries: this.getNumber('AI_MAX_RETRIES'),
      batchSize: this.getNumber('AI_BATCH_SIZE'),
      cacheTtl: this.getNumber('AI_CACHE_TTL'),
      resultExpiry: this.getNumber('AI_RESULT_EXPIRY'),
      providers: {
        openai: {
          apiKey: this.get('OPENAI_API_KEY'),
          orgId: this.get('OPENAI_ORG_ID')
        },
        deepseek: {
          apiKey: this.get('DEEPSEEK_API_KEY'),
          apiBase: this.get('DEEPSEEK_API_BASE')
        }
      }
    };
  }
} 