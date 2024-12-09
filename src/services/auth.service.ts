import { message } from 'antd';
import { request } from '../utils/request';

interface SocialLoginParams {
  platform: Social.Platform;
  code: string;
  state?: string;
}

class AuthService {
  async socialLogin(params: SocialLoginParams): Promise<Social.LoginResponse> {
    try {
      const response = await request.post<Social.LoginResponse>('/api/auth/social-login', params);
      return response;
    } catch (error) {
      message.error('社交登录失败');
      throw error;
    }
  }
}

export const authService = new AuthService(); 