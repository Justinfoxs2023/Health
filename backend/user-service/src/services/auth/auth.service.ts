import { BaseService } from '../base.service';
import { UserService } from '../user.service';
import { JwtService } from './jwt.service';
import { OAuthService } from './oauth.service';
import { SecurityService } from '../security.service';
import { AuthError } from '../../utils/errors';

export class AuthService extends BaseService {
  private userService: UserService;
  private jwtService: JwtService;
  private oauthService: OAuthService;
  private securityService: SecurityService;

  constructor() {
    super('AuthService');
    this.userService = new UserService();
    this.jwtService = new JwtService();
    this.oauthService = new OAuthService();
    this.securityService = new SecurityService();
  }

  async login(email: string, password: string, deviceInfo: any) {
    try {
      // 验证用户
      const user = await this.userService.validateUser(email, password);
      
      // 检查账户状态
      await this.securityService.checkAccountStatus(user.id);
      
      // 验证设备
      await this.securityService.validateDevice(user.id, deviceInfo);
      
      // 生成令牌
      const tokens = await this.generateAuthTokens(user);
      
      // 记录登录
      await this.logUserLogin(user.id, deviceInfo);
      
      return {
        user: this.userService.sanitizeUser(user),
        ...tokens
      };
    } catch (error) {
      this.logger.error('Login failed', error);
      throw error;
    }
  }

  async oauthLogin(platform: string, code: string, deviceInfo: any) {
    try {
      // 获取OAuth用户信息
      const oauthUser = await this.oauthService.getUserInfo(platform, code);
      
      // 查找或创建用户
      let user = await this.userService.findByOAuth(platform, oauthUser.id);
      if (!user) {
        user = await this.userService.createOAuthUser(platform, oauthUser);
      }
      
      // 验证设备
      await this.securityService.validateDevice(user.id, deviceInfo);
      
      // 生成令牌
      const tokens = await this.generateAuthTokens(user);
      
      return {
        user: this.userService.sanitizeUser(user),
        ...tokens
      };
    } catch (error) {
      this.logger.error('OAuth login failed', error);
      throw error;
    }
  }

  private async generateAuthTokens(user: any) {
    const accessToken = await this.jwtService.generateAccessToken(user);
    const refreshToken = await this.jwtService.generateRefreshToken(user);
    
    await this.redis.setex(
      `refresh_token:${user.id}`,
      this.config.jwt.refreshTokenTTL,
      refreshToken
    );
    
    return { accessToken, refreshToken };
  }

  private async logUserLogin(userId: string, deviceInfo: any) {
    await this.userService.updateLastLogin(userId);
    await this.securityService.recordLoginAttempt(userId, deviceInfo, true);
  }
} 