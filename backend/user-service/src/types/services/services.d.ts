import { BaseService } from './base';

// 用户服务
export interface IUserService extends BaseService {
  findById(id: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
  updateUser(id: string, data: any): Promise<any>;
  uploadAvatar(userId: string, file: any): Promise<string>;
  sanitizeUser(user: any): any;
}

// 认证服务
export interface IAuthService extends BaseService {
  validateToken(token: string): Promise<boolean>;
  login(email: string, password: string): Promise<any>;
  oauthLogin(platform: string, code: string): Promise<any>;
}

// 其他服务接口... 