import { Injectable } from '@nestjs/common';
import { Logger } from '../utils/logger';
import { SecurityConfig } from './security.config';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  /**
   * 加密数据
   */
  async encrypt(data: string, key: string): Promise<{
    encrypted: string;
    iv: string;
    tag: string;
  }> {
    try {
      // 生成随机IV
      const iv = crypto.randomBytes(SecurityConfig.ENCRYPTION.ivLength);
      
      // 从密码派生密钥
      const salt = crypto.randomBytes(SecurityConfig.ENCRYPTION.saltLength);
      const derivedKey = crypto.pbkdf2Sync(
        key,
        salt,
        SecurityConfig.ENCRYPTION.iterations,
        SecurityConfig.ENCRYPTION.keyLength,
        SecurityConfig.ENCRYPTION.keyDerivation.digest
      );

      // 创建加密器
      const cipher = crypto.createCipheriv(
        SecurityConfig.ENCRYPTION.algorithm,
        derivedKey,
        iv,
        { authTagLength: SecurityConfig.ENCRYPTION.tagLength }
      );

      // 加密数据
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // 获取认证标签
      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      this.logger.error('数据加密失败', error);
      throw error;
    }
  }

  /**
   * 解密数据
   */
  async decrypt(
    encrypted: string,
    key: string,
    iv: string,
    tag: string
  ): Promise<string> {
    try {
      // 从密码派生密钥
      const salt = crypto.randomBytes(SecurityConfig.ENCRYPTION.saltLength);
      const derivedKey = crypto.pbkdf2Sync(
        key,
        salt,
        SecurityConfig.ENCRYPTION.iterations,
        SecurityConfig.ENCRYPTION.keyLength,
        SecurityConfig.ENCRYPTION.keyDerivation.digest
      );

      // 创建解密器
      const decipher = crypto.createDecipheriv(
        SecurityConfig.ENCRYPTION.algorithm,
        derivedKey,
        Buffer.from(iv, 'hex'),
        { authTagLength: SecurityConfig.ENCRYPTION.tagLength }
      );

      // 设置认证标签
      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      // 解密数据
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      this.logger.error('数据解密失败', error);
      throw error;
    }
  }

  /**
   * 哈希密码
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password, {
        type: SecurityConfig.HASH.argon2.type,
        memoryCost: SecurityConfig.HASH.argon2.memoryCost,
        timeCost: SecurityConfig.HASH.argon2.timeCost,
        parallelism: SecurityConfig.HASH.argon2.parallelism,
        saltLength: SecurityConfig.HASH.argon2.saltLength,
        hashLength: SecurityConfig.HASH.argon2.hashLength
      });
    } catch (error) {
      this.logger.error('密码哈希失败', error);
      throw error;
    }
  }

  /**
   * 验证密码
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      this.logger.error('密码验证失败', error);
      throw error;
    }
  }

  /**
   * 生成访问令牌
   */
  generateAccessToken(payload: any): string {
    try {
      return jwt.sign(payload, SecurityConfig.JWT.accessToken.secret, {
        expiresIn: SecurityConfig.JWT.accessToken.expiresIn,
        issuer: SecurityConfig.JWT.issuer,
        audience: SecurityConfig.JWT.audience
      });
    } catch (error) {
      this.logger.error('生成访问令牌失败', error);
      throw error;
    }
  }

  /**
   * 生成刷新令牌
   */
  generateRefreshToken(payload: any): string {
    try {
      return jwt.sign(payload, SecurityConfig.JWT.refreshToken.secret, {
        expiresIn: SecurityConfig.JWT.refreshToken.expiresIn,
        issuer: SecurityConfig.JWT.issuer,
        audience: SecurityConfig.JWT.audience
      });
    } catch (error) {
      this.logger.error('生成刷新令牌失败', error);
      throw error;
    }
  }

  /**
   * 验证访问令牌
   */
  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, SecurityConfig.JWT.accessToken.secret, {
        issuer: SecurityConfig.JWT.issuer,
        audience: SecurityConfig.JWT.audience
      });
    } catch (error) {
      this.logger.error('验证访问令牌失败', error);
      throw error;
    }
  }

  /**
   * 验证刷新令牌
   */
  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, SecurityConfig.JWT.refreshToken.secret, {
        issuer: SecurityConfig.JWT.issuer,
        audience: SecurityConfig.JWT.audience
      });
    } catch (error) {
      this.logger.error('验证刷新令牌失败', error);
      throw error;
    }
  }

  /**
   * 验证密码强度
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // 检查长度
    if (password.length < SecurityConfig.PASSWORD_POLICY.minLength) {
      errors.push(`密码长度不能小于${SecurityConfig.PASSWORD_POLICY.minLength}个字符`);
    }
    if (password.length > SecurityConfig.PASSWORD_POLICY.maxLength) {
      errors.push(`密码长度不能大于${SecurityConfig.PASSWORD_POLICY.maxLength}个字符`);
    }

    // 检查复杂度
    if (SecurityConfig.PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('密码必须包含大写字母');
    }
    if (SecurityConfig.PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('密码必须包含小写字母');
    }
    if (SecurityConfig.PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
      errors.push('密码必须包含数字');
    }
    if (SecurityConfig.PASSWORD_POLICY.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('密码必须包含特殊字符');
    }

    // 检查重复字符
    const repeatingChars = new RegExp(`(.)\\1{${SecurityConfig.PASSWORD_POLICY.maxRepeatingChars},}`);
    if (repeatingChars.test(password)) {
      errors.push(`密码不能包含${SecurityConfig.PASSWORD_POLICY.maxRepeatingChars + 1}个以上连续重复的字符`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 数据脱敏
   */
  maskSensitiveData(data: any): any {
    if (!data) return data;

    const mask = (value: string, rule: any): string => {
      if (!value) return value;
      if (rule.pattern) {
        return value.replace(rule.pattern, rule.mask);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return value.substring(0, rule.maxLength) + (rule.suffix || '');
      }
      return value;
    };

    const process = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(item => process(item));
      }

      if (typeof obj === 'object' && obj !== null) {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          // 检查是否是敏感字段
          if (SecurityConfig.DATA_MASKING.sensitiveFields.includes(key)) {
            result[key] = '******';
            continue;
          }

          // 应用脱敏规则
          const rule = SecurityConfig.DATA_MASKING.rules[key];
          if (rule && typeof value === 'string') {
            result[key] = mask(value, rule);
          } else {
            result[key] = process(value);
          }
        }
        return result;
      }

      return obj;
    };

    return process(data);
  }

  /**
   * 生成安全头
   */
  generateSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    // HSTS
    if (SecurityConfig.SECURITY_HEADERS.hsts) {
      let value = `max-age=${SecurityConfig.SECURITY_HEADERS.hsts.maxAge}`;
      if (SecurityConfig.SECURITY_HEADERS.hsts.includeSubDomains) {
        value += '; includeSubDomains';
      }
      if (SecurityConfig.SECURITY_HEADERS.hsts.preload) {
        value += '; preload';
      }
      headers['Strict-Transport-Security'] = value;
    }

    // Content-Type Options
    if (SecurityConfig.SECURITY_HEADERS.noSniff) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    // Frame Options
    if (SecurityConfig.SECURITY_HEADERS.frameGuard) {
      headers['X-Frame-Options'] = SecurityConfig.SECURITY_HEADERS.frameGuard.action.toUpperCase();
    }

    // XSS Protection
    if (SecurityConfig.SECURITY_HEADERS.xssFilter) {
      headers['X-XSS-Protection'] = '1; mode=block';
    }

    // Referrer Policy
    if (SecurityConfig.SECURITY_HEADERS.referrerPolicy) {
      headers['Referrer-Policy'] = SecurityConfig.SECURITY_HEADERS.referrerPolicy;
    }

    // CSP
    if (SecurityConfig.CSP) {
      const csp = Object.entries(SecurityConfig.CSP.directives)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key} ${value.join(' ')}`;
          }
          return `${key} ${value}`;
        })
        .join('; ');

      headers[SecurityConfig.CSP.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'] = csp;
    }

    return headers;
  }

  /**
   * 生成随机令牌
   */
  generateRandomToken(length: number = 32): string {
    try {
      return crypto.randomBytes(length).toString('hex');
    } catch (error) {
      this.logger.error('生成随机令牌失败', error);
      throw error;
    }
  }

  /**
   * 生成安全的会话ID
   */
  generateSessionId(): string {
    try {
      return crypto.randomBytes(32).toString('base64');
    } catch (error) {
      this.logger.error('生成会话ID失败', error);
      throw error;
    }
  }
} 