import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { Logger } from '../utils/logger';
import { validateLogin, validateOAuth } from '../utils/validators';

export class AuthController {
  private authService: AuthService;
  private logger: Logger;

  constructor() {
    this.authService = new AuthService();
    this.logger = new Logger('AuthController');
  }

  /**
   * 用户登录
   */
  async login(req: Request, res: Response) {
    try {
      const { error } = validateLogin(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: error.details[0].message
        });
      }

      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      return res.json({
        code: 200,
        data: result
      });
    } catch (error) {
      this.logger.error('登录失败', error);
      return res.status(401).json({
        code: 401,
        message: error.message
      });
    }
  }

  /**
   * OAuth登录
   */
  async oauthLogin(req: Request, res: Response) {
    try {
      const { error } = validateOAuth(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: error.details[0].message
        });
      }

      const { platform, code } = req.body;
      const result = await this.authService.oauthLogin(platform, code);

      return res.json({
        code: 200,
        data: result
      });
    } catch (error) {
      this.logger.error('OAuth登录失败', error);
      return res.status(401).json({
        code: 401,
        message: error.message
      });
    }
  }

  /**
   * 刷新Token
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const { userId, refreshToken } = req.body;
      const tokens = await this.authService.refreshToken(userId, refreshToken);

      return res.json({
        code: 200,
        data: tokens
      });
    } catch (error) {
      this.logger.error('刷新Token失败', error);
      return res.status(401).json({
        code: 401,
        message: error.message
      });
    }
  }
} 