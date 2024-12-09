import { Container } from 'inversify';
import { TYPES } from './types';
import { Logger } from '../types/logger';
import { LoggerImpl } from '../utils/logger';
import { RedisClient } from '../infrastructure/redis/types';
import { RedisClientImpl } from '../infrastructure/redis/redis.impl';
import { JwtService } from '../utils/jwt/types';
import { JwtServiceImpl } from '../utils/jwt/jwt.service';
import { UserRepository } from '../repositories/user.repository';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';
import { RoleRepository } from '../repositories/role.repository';
import { RoleRepositoryImpl } from '../repositories/role.repository.impl';
import { EmailService } from '../services/email/types';
import { EmailServiceImpl } from '../services/email/email.service';
import { PushService } from '../services/push/types';
import { PushServiceImpl } from '../services/push/push.service';

const container = new Container();

// Infrastructure
container.bind<Logger>(TYPES.Logger).to(LoggerImpl);
container.bind<RedisClient>(TYPES.Redis).to(RedisClientImpl);
container.bind<JwtService>(TYPES.JwtService).to(JwtServiceImpl);

// Repositories
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
container.bind<RoleRepository>(TYPES.RoleRepository).to(RoleRepositoryImpl);

// Services
container.bind<EmailService>(TYPES.EmailService).to(EmailServiceImpl);
container.bind<PushService>(TYPES.PushService).to(PushServiceImpl);

export { container }; 