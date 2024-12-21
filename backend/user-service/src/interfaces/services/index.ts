import { Logger } from '../../utils/logger';
import { Redis } from 'ioredis';
import { Request, Response } from 'express';

// 基础服务接口
export interface IBaseService {
  /** logger 的描述 */
  logger: Logger;
  /** redis 的描述 */
  redis: Redis;
}

// 用户服务接口
export interface IUserService extends IBaseService {
  findById(id: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
  updateUser(id: string, data: any): Promise<any>;
  uploadAvatar(userId: string, file: any): Promise<string>;
  sanitizeUser(user: any): any;
  findByOAuth(platform: string, oauthId: string): Promise<any>;
  createOAuthUser(platform: string, oauthData: any): Promise<any>;
  validateUser(email: string, password: string): Promise<any>;
  updateLastLogin(userId: string): Promise<void>;
}

// 认证服务接口
export interface IAuthService extends IBaseService {
  validateToken(token: string): Promise<boolean>;
  getGoogleUserInfo(code: string): Promise<any>;
  getWechatUserInfo(code: string): Promise<any>;
  login(email: string, password: string, deviceInfo: any): Promise<any>;
  oauthLogin(platform: string, code: string, deviceInfo: any): Promise<any>;
}

// 安全服务接口
export interface ISecurityService extends IBaseService {
  checkAccountStatus(userId: string): Promise<void>;
  validateDevice(userId: string, deviceInfo: any): Promise<boolean>;
  recordLoginAttempt(userId: string, deviceInfo: any, success: boolean): Promise<void>;
  checkPermission(userId: string, resource: string, action: string): Promise<boolean>;
}

// 通知服务接口
export interface INotificationService extends IBaseService {
  sendVerificationCode(type: 'email' | 'sms', target: string): Promise<void>;
  sendNewDeviceAlert(userId: string, deviceInfo: any): Promise<void>;
  sendSecurityAlert(userId: string, alert: any): Promise<void>;
}

// 权限服务接口
export interface IPermissionService extends IBaseService {
  checkPermission(userId: string, resource: string, action: string): Promise<boolean>;
  grantPermission(roleId: string, resource: string, action: string): Promise<void>;
  revokePermission(roleId: string, resource: string, action: string): Promise<void>;
}
