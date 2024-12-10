import { Request, Response, NextFunction } from 'express';
import { createHash, createHmac } from 'crypto';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
});

// 请求速率限制器
const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'ratelimit',
  points: 10, // 请求次数
  duration: 1, // 时间窗口（秒）
  blockDuration: 60 * 15, // 封禁时间（秒）
});

// JWT刷新令牌中间件
export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '未提供访问令牌' });
    }

    // 验证当前令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // 检查令牌是否即将过期（比如还有5分钟过期）
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn < 300) { // 5分钟
      // 生成新令牌
      const newToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      
      // 将新令牌添加到响应头
      res.setHeader('X-New-Token', newToken);
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: '令牌已过期' });
    }
    return res.status(401).json({ error: '无效的令牌' });
  }
};

// CSRF保护中间件
export const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// CSRF令牌生成中间件
export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.csrfToken) {
    return res.status(500).json({ error: 'CSRF中间件未正确配置' });
  }
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  next();
};

// 请求签名验证中间件
export const validateRequestSignature = async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['x-request-signature'];
  const timestamp = req.headers['x-request-timestamp'];
  const nonce = req.headers['x-request-nonce'];

  if (!signature || !timestamp || !nonce) {
    return res.status(400).json({ error: '缺少请求签名参数' });
  }

  // 验证时间戳是否在有效期内（比如5分钟）
  const requestTime = Number(timestamp);
  if (Date.now() - requestTime > 5 * 60 * 1000) {
    return res.status(400).json({ error: '请求已过期' });
  }

  // 验证nonce是否被使用过
  const nonceKey = `nonce:${nonce}`;
  const nonceExists = await redis.exists(nonceKey);
  if (nonceExists) {
    return res.status(400).json({ error: '重复的请求' });
  }

  // 存储nonce（设置5分钟过期）
  await redis.set(nonceKey, '1', 'EX', 300);

  next();
};

// 访问控制中间件
export const accessControl = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: '无访问权限' });
    }
    next();
  };
};

// 速率限制中间件
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 100个请求
  message: { error: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

// IP黑名单中间件
export const ipBlacklist = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const blacklisted = await redis.sismember('ip:blacklist', ip);
  
  if (blacklisted) {
    return res.status(403).json({ error: 'IP已被封禁' });
  }
  
  next();
};

// 安全响应头中间件
export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  // 设置安全响应头
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
};

// 签名验证中间件
export const verifySignature = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = req.headers['x-timestamp'] as string;
  const nonce = req.headers['x-nonce'] as string;
  const signature = req.headers['x-signature'] as string;
  const apiKey = req.headers['x-api-key'] as string;

  if (!timestamp || !nonce || !signature || !apiKey) {
    return res.status(401).json({ error: '缺少必要的安全头信息' });
  }

  // 验证时间戳是否在有效期内（5分钟）
  const timestampNum = parseInt(timestamp);
  if (isNaN(timestampNum) || Math.abs(Date.now() - timestampNum) > 5 * 60 * 1000) {
    return res.status(401).json({ error: '请求已过期' });
  }

  // 验证签名
  const payload = `${apiKey}${timestamp}${nonce}${JSON.stringify(req.body)}`;
  const expectedSignature = createHmac('sha256', process.env.API_SECRET || '')
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: '签名验证失败' });
  }

  next();
};

// 数据加密中间件
export const encryptResponse = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (body: any): Response {
    if (body && typeof body === 'object') {
      // 生成随机密钥
      const key = createHash('sha256')
        .update(Math.random().toString())
        .digest('hex')
        .slice(0, 32);

      // 加密数据
      const cipher = createHmac('aes-256-gcm', key);
      const encrypted = cipher.update(JSON.stringify(body), 'utf8', 'hex');
      const authTag = cipher.digest('hex');

      // 使用公钥加密密钥（在实际应用中需要实现）
      const encryptedKey = key; // TODO: 使用客户端公钥加密

      body = {
        data: encrypted,
        tag: authTag,
        key: encryptedKey,
      };
    }

    return originalSend.call(this, body);
  };

  next();
};

// XSS 防护中间件
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  // 设置安全响应头
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
};

// SQL 注入防护中间件
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const isSuspicious = (value: string): boolean => {
    const sqlPattern = /(\b(select|insert|update|delete|drop|union|exec|declare)\b)|(['"])/i;
    return sqlPattern.test(value);
  };

  const checkObject = (obj: any): boolean => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && isSuspicious(obj[key])) {
        return true;
      }
      if (typeof obj[key] === 'object' && checkObject(obj[key])) {
        return true;
      }
    }
    return false;
  };

  if (
    checkObject(req.query) ||
    checkObject(req.body) ||
    checkObject(req.params)
  ) {
    return res.status(403).json({ error: '检测到潜在的注入攻击' });
  }

  next();
};

// 组合所有安全中间件
export const securityMiddleware = [
  verifySignature,
  rateLimitMiddleware,
  encryptResponse,
  xssProtection,
  sqlInjectionProtection,
  refreshTokenMiddleware,
  csrfProtection,
  generateCsrfToken,
  validateRequestSignature,
  accessControl(['admin']),
  securityHeaders,
]; 