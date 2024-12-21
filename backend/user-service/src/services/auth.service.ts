import { IAuthToken } from '../types/interfaces/auth.interface';
import { ILogger } from '../types/logger';
import { IUser } from '../types/interfaces/user.interface';
import { JwtService } from '../utils/jwt.service';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.JwtService) private jwtService: JwtService,
  ) {}

  async login(user: IUser): Promise<IAuthToken> {
    try {
      const accessToken = await this.jwtService.generateAccessToken({
        userId: user.id,
        roles: user.roles,
      });

      const refreshToken = await this.jwtService.generateRefreshToken(user.id);

      return {
        accessToken,
        refreshToken,
        expiresIn: 3600, // 1小时
      };
    } catch (error) {
      this.logger.error('登录失败', error);
      throw error;
    }
  }
}
