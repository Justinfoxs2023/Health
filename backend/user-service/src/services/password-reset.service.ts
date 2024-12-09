import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';
import { RedisClient } from '../infrastructure/redis';
import { EmailService } from '../utils/email.service';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword, generateToken } from '../utils/crypto';

@injectable()
export class PasswordResetService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Redis) private redis: RedisClient,
    @inject(TYPES.EmailService) private emailService: EmailService,
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async initiatePasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('用户不存在');
    }

    const token = await generateToken(32);
    const key = `pwd:reset:${user.id}`;
    
    await this.redis.setex(key, 3600, token); // 1小时有效期

    await this.emailService.sendEmail({
      to: email,
      subject: '密码重置',
      template: 'password-reset',
      context: {
        resetLink: `${process.env.APP_URL}/reset-password?token=${token}&userId=${user.id}`
      }
    });
  }

  async resetPassword(userId: string, token: string, newPassword: string): Promise<void> {
    const key = `pwd:reset:${userId}`;
    const storedToken = await this.redis.get(key);

    if (!storedToken || storedToken !== token) {
      throw new Error('无效的重置链接');
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.userRepository.update(userId, { password: hashedPassword });
    await this.redis.del(key);
  }
} 