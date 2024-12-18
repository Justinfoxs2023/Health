import { Request, Response, NextFunction } from 'express';

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
}

// 认证服务接口
export interface IAuthService extends IBaseService {
  validateToken(token: string): Promise<boolean>;
  getGoogleUserInfo(code: string): Promise<any>;
  getWechatUserInfo(code: string): Promise<any>;
}

// 安全服务接口
export interface ISecurityService extends IBaseService {
  checkPermission(userId: string, resource: string, action: string): Promise<boolean>;
  validateRequest(req: Request): Promise<boolean>;
  encryptData(data: any): Promise<string>;
  decryptData(encryptedData: string): Promise<any>;
}
