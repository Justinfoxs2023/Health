import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { User } from '../types/interfaces/user.interface';
import { AuthToken } from '../types/interfaces/auth.interface';
import { JwtService } from '../utils/jwt.service';
import { Logger } from '../types/logger';

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.JwtService) private jwtService: JwtService
  ) {}

  async login(user: User): Promise<AuthToken> {
    try {
      const accessToken = await this.jwtService.generateAccessToken({
        userId: user.id,
        roles: user.roles
      });

      const refreshToken = await this.jwtService.generateRefreshToken(user.id);

      return {
        accessToken,
        refreshToken,
        expiresIn: 3600 // 1小时
      };
    } catch (error) {
      this.logger.error('登录失败', error);
      throw error;
    }
  }
} 