import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';
import { RedisClient } from '../infrastructure/redis';
import { EmailService } from '../utils/email.service';
import { generateToken } from '../utils/crypto';

@injectable()
export class EmailVerificationService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Redis) private redis: RedisClient,
    @inject(TYPES.EmailService) private emailService: EmailService
  ) {}

  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    try {
      const token = await generateToken(32);
      const key = `email:verify:${userId}`;
      
      // 存储验证token
      await this.redis.setex(key, 3600, token); // 1小时有效期

      // 发送验证邮件
      await this.emailService.sendEmail({
        to: email,
        subject: '邮箱验证',
        template: 'email-verification',
        context: {
          verificationLink: `${process.env.APP_URL}/verify-email?token=${token}&userId=${userId}`
        }
      });

      this.logger.info(`发送验证邮件: ${email}`);
    } catch (error) {
      this.logger.error('发送验证邮件失败', error);
      throw error;
    }
  }

  async verifyEmail(userId: string, token: string): Promise<boolean> {
    const key = `email:verify:${userId}`;
    const storedToken = await this.redis.get(key);

    if (!storedToken || storedToken !== token) {
      throw new Error('无效的验证链接');
    }

    // 更新用户邮箱验证状态
    await this.userRepository.update(userId, { emailVerified: true });
    await this.redis.del(key);

    return true;
  }
} 