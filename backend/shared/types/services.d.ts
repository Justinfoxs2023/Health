import { Logger } from '../utils/logger';
import { Redis } from '../utils/redis';

// 基础服务接口
export interface BaseService {
  logger: Logger;
  init(): Promise<void>;
  validate(data: any): Promise<boolean>;
  handleError(error: Error): void;
}

// 用户服务接口
export interface IUserService extends BaseService {
  findById(id: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
  updateUser(id: string, data: any): Promise<any>;
  sanitizeUser(user: any): any;
  uploadAvatar(userId: string, file: Express.Multer.File): Promise<string>;
}

// Redis服务接口
export interface IRedisService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<'OK'>;
  setex(key: string, seconds: number, value: string): Promise<'OK'>;
  del(key: string | string[]): Promise<number>;
  lpush(key: string, value: string): Promise<number>;
  ltrim(key: string, start: number, stop: number): Promise<'OK'>;
  sadd(key: string, ...members: string[]): Promise<number>;
  srem(key: string, ...members: string[]): Promise<number>;
  smembers(key: string): Promise<string[]>;
  sismember(key: string, member: string): Promise<number>;
  remove(key: string): Promise<void>;
}

// 验证器接口
export interface IValidator {
  validate(data: any, schema: any): Promise<{
    error?: {
      details: Array<{
        message: string;
      }>;
    };
  }>;
} 