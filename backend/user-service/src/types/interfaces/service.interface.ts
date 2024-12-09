import { Logger } from '../logger';
import { RedisClient } from '../../infrastructure/redis/types';
import { User, CreateUserDTO, UpdateUserDTO } from './user.interface';

export interface IBaseService {
  logger: Logger;
  redis: RedisClient;
}

export interface IUserService extends IBaseService {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  createUser(dto: CreateUserDTO): Promise<User>;
  updateUser(id: string, data: UpdateUserDTO): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export interface IAuthService extends IBaseService {
  login(dto: LoginDTO): Promise<AuthToken>;
  refreshToken(token: string): Promise<AuthToken>;
  logout(userId: string): Promise<void>;
  validateToken(token: string): Promise<TokenPayload>;
}

export interface IEmailService extends IBaseService {
  sendEmail(options: EmailOptions): Promise<void>;
  sendVerificationEmail(to: string, code: string): Promise<void>;
  sendSecurityAlert(to: string, notification: SecurityNotification): Promise<void>;
} 