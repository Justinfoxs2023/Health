import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

@Injectable()
export class SecurityConfig {
  // 加密配置
  static readonly ENCRYPTION = {
    // AES加密配置
    algorithm: 'aes-256-gcm',
    keyLength: 32, // 256位密钥
    ivLength: 16, // 128位IV
    saltLength: 32, // 256位盐值
    tagLength: 16, // 128位认证标签
    iterations: 100000, // PBKDF2迭代次数
    
    // 密钥派生配置
    keyDerivation: {
      digest: 'sha512',
      encoding: 'hex' as const
    }
  };

  // 哈希配置
  static readonly HASH = {
    // Argon2配置
    argon2: {
      type: argon2.argon2id,
      memoryCost: 65536, // 64MB
      timeCost: 3, // 迭代次数
      parallelism: 4, // 并行度
      saltLength: 32, // 盐值长度
      hashLength: 32 // 哈希长度
    },
    
    // 通用哈希配置
    algorithm: 'sha512',
    encoding: 'hex' as const
  };

  // JWT配置
  static readonly JWT = {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET || crypto.randomBytes(32).toString('hex'),
      expiresIn: '15m'
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET || crypto.randomBytes(32).toString('hex'),
      expiresIn: '7d'
    },
    issuer: 'health-ai-service',
    audience: 'health-ai-client'
  };

  // 密码策略
  static readonly PASSWORD_POLICY = {
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxRepeatingChars: 3,
    preventCommonPasswords: true,
    preventPersonalInfo: true,
    passwordHistory: 5,
    maxAge: 90 * 24 * 60 * 60 * 1000 // 90天
  };

  // 会话配置
  static readonly SESSION = {
    name: 'health.sid',
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    maxAge: 24 * 60 * 60 * 1000, // 1天
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60 * 1000 // 1天
    }
  };

  // 速率限制
  static readonly RATE_LIMIT = {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 每个IP最多100个请求
    message: '请求过于频繁，请稍后再试',
    standardHeaders: true,
    legacyHeaders: false
  };

  // CORS配置
  static readonly CORS = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24小时
  };

  // CSP配置
  static readonly CSP = {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
      reportUri: '/api/csp-report',
      reportOnly: false
    }
  };

  // 安全头配置
  static readonly SECURITY_HEADERS = {
    hsts: {
      maxAge: 31536000, // 1年
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    frameGuard: {
      action: 'deny' as const
    },
    xssFilter: true,
    referrerPolicy: 'same-origin' as const
  };

  // 数据脱敏规则
  static readonly DATA_MASKING = {
    rules: {
      phoneNumber: {
        pattern: /^(\d{3})\d{4}(\d{4})$/,
        mask: '$1****$2'
      },
      email: {
        pattern: /^(.{3}).*(@.*)$/,
        mask: '$1***$2'
      },
      idCard: {
        pattern: /^(\d{6}).*(\d{4})$/,
        mask: '$1********$2'
      },
      bankCard: {
        pattern: /^(\d{4}).*(\d{4})$/,
        mask: '$1 **** **** $2'
      },
      address: {
        maxLength: 10,
        suffix: '...'
      }
    },
    sensitiveFields: [
      'password',
      'token',
      'secret',
      'key',
      'credential',
      'authorization'
    ]
  };

  // 审计日志配置
  static readonly AUDIT_LOG = {
    enabled: true,
    events: [
      'login',
      'logout',
      'data_access',
      'data_modification',
      'permission_change',
      'system_config'
    ],
    retention: 90 * 24 * 60 * 60 * 1000, // 90天
    sensitiveFields: [
      'password',
      'token',
      'secret',
      'key',
      'credential',
      'authorization'
    ]
  };

  // 健康检查配置
  static readonly HEALTH_CHECK = {
    interval: 30000, // 30秒
    timeout: 5000, // 5秒
    services: [
      {
        name: 'database',
        url: process.env.MONGODB_URI,
        type: 'mongodb'
      },
      {
        name: 'redis',
        url: process.env.REDIS_URI,
        type: 'redis'
      },
      {
        name: 'tensorflow',
        type: 'custom',
        check: async () => {
          // 自定义健康检查逻辑
          return true;
        }
      }
    ]
  };
} 