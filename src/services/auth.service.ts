import { message } from 'antd';
import { request } from '../utils/request';

interface ISocialLoginParams {
  /** platform 的描述 */
  platform: SocialPlatform;
  /** code 的描述 */
  code: string;
  /** state 的描述 */
  state: string;
}

class AuthService {
  async socialLogin(params: ISocialLoginParams): Promise<Social.LoginResponse> {
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
