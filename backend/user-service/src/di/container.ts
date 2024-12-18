import { Container } from 'inversify';
import { EmailServiceImpl } from '../services/email/email.service';
import { IEmailService } from '../services/email/types';
import { IJwtService } from '../utils/jwt/types';
import { ILogger } from '../types/logger';
import { IPushService } from '../services/push/types';
import { IRedisClient } from '../infrastructure/redis/types';
import { IRoleRepository } from '../repositories/role.repository';
import { JwtServiceImpl } from '../utils/jwt/jwt.service';
import { LoggerImpl } from '../utils/logger';
import { PushServiceImpl } from '../services/push/push.service';
import { RedisClientImpl } from '../infrastructure/redis/redis.impl';
import { RoleRepositoryImpl } from '../repositories/role.repository.impl';
import { TYPES } from './types';
import { UserRepository } from '../repositories/user.repository';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';

const container = new Container();

// Infrastructure
container.bind<ILogger>(TYPES.Logger).to(LoggerImpl);
container.bind<IRedisClient>(TYPES.Redis).to(RedisClientImpl);
container.bind<IJwtService>(TYPES.JwtService).to(JwtServiceImpl);

// Repositories
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
container.bind<IRoleRepository>(TYPES.RoleRepository).to(RoleRepositoryImpl);

// Services
container.bind<IEmailService>(TYPES.EmailService).to(EmailServiceImpl);
container.bind<IPushService>(TYPES.PushService).to(PushServiceImpl);

export { container };
