import { ApiService } from './api.service';
import { storage } from '../utils';

export class AuthService {
  private api: ApiService;

  constructor() {
    this.api = ApiService.getInstance();
  }

  /**
   * 用户登录
   */
  async login(credentials: { email: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    await this.handleAuthResponse(response);
    return response;
  }

  /**
   * OAuth登录
   */
  async oauthLogin(platform: string, code: string) {
    const response = await this.api.post('/auth/oauth', { platform, code });
    await this.handleAuthResponse(response);
    return response;
  }

  /**
   * 刷新Token
   */
  async refreshToken() {
    const refreshToken = await storage.get('refreshToken');
    const userId = await storage.get('userId');

    if (!refreshToken || !userId) {
      throw new Error('No refresh token available');
    }

    const response = await this.api.post('/auth/refresh', {
      userId,
      refreshToken,
    });

    await this.handleAuthResponse(response);
    return response;
  }

  /**
   * 退出登录
   */
  async logout() {
    await storage.remove('token');
    await storage.remove('refreshToken');
    await storage.remove('userId');
  }

  /**
   * 处理认证响应
   */
  private async handleAuthResponse(response: any) {
    const { accessToken, refreshToken, user } = response;

    await Promise.all([
      storage.set('token', accessToken),
      storage.set('refreshToken', refreshToken),
      storage.set('userId', user.id),
    ]);
  }

  /**
   * 获取当前Token
   */
  async getToken(): Promise<string | null> {
    return storage.get('token');
  }

  /**
   * 检查是否已登录
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}
