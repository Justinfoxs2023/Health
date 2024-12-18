import { ILogger } from '../logger';
import { IRedisClient } from '../../infrastructure/redis/types';
import { IUser, ICreateUserDTO, IUpdateUserDTO } from './user.interface';

export interface IBaseService {
  /** logger 的描述 */
  logger: ILogger;
  /** redis 的描述 */
  redis: IRedisClient;
}

export interface IUserService extends IBaseService {
  findById(id: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  createUser(dto: ICreateUserDTO): Promise<IUser>;
  updateUser(id: string, data: IUpdateUserDTO): Promise<IUser>;
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
