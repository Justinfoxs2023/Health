import { AuthService } from './auth.service';
import { ILogger } from '../types/logger';
import { ISocialProfile } from '../types/user.types';
import { TYPES } from '../di/types';
import { UserRepository } from '../repositories/user.repository';
import { injectable, inject } from 'inversify';

@injectable()
export class SocialAuthService {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.AuthService) private authService: AuthService,
  ) {}

  async handleSocialLogin(platform: string, profile: ISocialProfile): Promise<any> {
    try {
      // 查找或创建用户
      let user = await this.userRepository.findBySocialId(platform, profile.id);

      if (!user) {
        user = await this.userRepository.create({
          email: profile.email,
          username: profile.name,
          socialConnections: {
            [platform]: {
              id: profile.id,
              profile: profile,
            },
          },
          emailVerified: true, // 社交登录的邮箱默认已验证
        });
      }

      // 生成登录令牌
      return this.authService.generateTokens(user);
    } catch (error) {
      this.logger.error('社交登录失败', error);
      throw error;
    }
  }

  async linkSocialAccount(
    userId: string,
    platform: string,
    profile: ISocialProfile,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      $set: {
        [`socialConnections.${platform}`]: {
          id: profile.id,
          profile: profile,
        },
      },
    });
  }
}
