import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserService } from './user.service';
import { RoleService } from './role.service';

@Injectable()
export class SecurityService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly saltRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  // 数据加密
  async encryptData(data: any, userId: string): Promise<string> {
    try {
      // 生成加密密钥
      const key = await this.generateKey(userId);
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      // 加密数据
      const encrypted = Buffer.concat([
        cipher.update(JSON.stringify(data), 'utf8'),
        cipher.final()
      ]);

      // 获取认证标签
      const authTag = cipher.getAuthTag();

      // 组合��密结果
      const result = Buffer.concat([
        iv,
        authTag,
        encrypted
      ]);

      return result.toString('base64');
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Data encryption failed');
    }
  }

  // 数据解密
  async decryptData(encryptedData: string, userId: string): Promise<any> {
    try {
      // 解析加密数据
      const data = Buffer.from(encryptedData, 'base64');
      const iv = data.slice(0, this.ivLength);
      const authTag = data.slice(this.ivLength, this.ivLength + 16);
      const encrypted = data.slice(this.ivLength + 16);

      // 生成解密密钥
      const key = await this.generateKey(userId);
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(authTag);

      // 解密数据
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ]);

      return JSON.parse(decrypted.toString('utf8'));
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Data decryption failed');
    }
  }

  // 生成加密密钥
  private async generateKey(userId: string): Promise<Buffer> {
    const user = await this.userService.findById(userId);
    const salt = await this.getSalt(userId);
    return crypto.pbkdf2Sync(
      user.secretKey,
      salt,
      100000,
      this.keyLength,
      'sha512'
    );
  }

  // 获取盐值
  private async getSalt(userId: string): Promise<string> {
    const user = await this.userService.findById(userId);
    return user.salt || this.generateSalt();
  }

  // 生成盐值
  private generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // 密码哈希
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  // 验证密码
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // 生成访问令牌
  async generateAccessToken(userId: string, roles: string[]): Promise<string> {
    const payload = {
      sub: userId,
      roles,
      type: 'access'
    };
    return this.jwtService.sign(payload);
  }

  // 生成刷新令牌
  async generateRefreshToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
      type: 'refresh'
    };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  // 验证令牌
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // 访问控制检查
  async checkAccess(userId: string, resource: string, action: string): Promise<boolean> {
    try {
      const user = await this.userService.findById(userId);
      const roles = await this.roleService.getUserRoles(userId);
      
      // 检查用户状态
      if (!user.isActive) {
        return false;
      }

      // 检查角色权限
      for (const role of roles) {
        const permissions = await this.roleService.getRolePermissions(role);
        if (this.hasPermission(permissions, resource, action)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Access check failed:', error);
      return false;
    }
  }

  // 检查权限
  private hasPermission(permissions: any[], resource: string, action: string): boolean {
    return permissions.some(permission => 
      permission.resource === resource && 
      permission.actions.includes(action)
    );
  }

  // 数据脱敏
  async maskSensitiveData(data: any, level: string): Promise<any> {
    const maskingRules = this.getMaskingRules(level);
    return this.applyMaskingRules(data, maskingRules);
  }

  // 获取脱敏规则
  private getMaskingRules(level: string): any {
    const rules = {
      high: {
        phoneNumber: (value: string) => `****${value.slice(-4)}`,
        email: (value: string) => `${value.slice(0, 3)}***@${value.split('@')[1]}`,
        idNumber: (value: string) => `${value.slice(0, 6)}********${value.slice(-4)}`,
        name: (value: string) => `${value.charAt(0)}${'*'.repeat(value.length - 1)}`,
        address: (value: string) => `${value.slice(0, 6)}****`,
      },
      medium: {
        phoneNumber: (value: string) => `${value.slice(0, 3)}****${value.slice(-4)}`,
        email: (value: string) => `${value.slice(0, 3)}***@${value.split('@')[1]}`,
        idNumber: (value: string) => `${value.slice(0, 6)}****${value.slice(-4)}`,
        name: (value: string) => value,
        address: (value: string) => value,
      },
      low: {
        phoneNumber: (value: string) => value,
        email: (value: string) => value,
        idNumber: (value: string) => `${value.slice(0, 6)}****${value.slice(-4)}`,
        name: (value: string) => value,
        address: (value: string) => value,
      }
    };
    return rules[level] || rules.medium;
  }

  // 应用脱敏规则
  private applyMaskingRules(data: any, rules: any): any {
    if (typeof data !== 'object') {
      return data;
    }

    const masked = Array.isArray(data) ? [] : {};

    for (const key in data) {
      if (rules[key]) {
        masked[key] = rules[key](data[key]);
      } else if (typeof data[key] === 'object') {
        masked[key] = this.applyMaskingRules(data[key], rules);
      } else {
        masked[key] = data[key];
      }
    }

    return masked;
  }

  // 审计日志
  async logAuditEvent(event: {
    userId: string;
    action: string;
    resource: string;
    details: any;
  }): Promise<void> {
    // 实现审计日志记录逻辑
    console.log('Audit log:', event);
  }
} 