import { STORAGE_KEYS } from '../../../constants';
import { authService } from '../index';
import { http } from '../../http';
import { storage } from '../../storage';

jest.mock('../../http');
jest.mock('../../storage');

describe('AuthService', () => {
  const mockUser = {
    id: '1',
    username: 'test',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthResponse = {
    user: mockUser,
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // 清理存储和认证状态
    storage.clear();
    authService['clearAuth']();
  });

  describe('初始化', () => {
    it('应该从存储中恢复认证状态', () => {
      storage.getItem = jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case STORAGE_KEYS.TOKEN:
            return 'stored-token';
          case STORAGE_KEYS.REFRESH_TOKEN:
            return 'stored-refresh-token';
          case STORAGE_KEYS.USER:
            return mockUser;
          default:
            return null;
        }
      });

      // 重新创建实例以触发初始化
      const instance = AuthService['instance'];
      AuthService['instance'] = undefined as any;
      const service = AuthService.getInstance();

      expect(service.getCurrentUser()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
      expect(http.defaults.headers.common.Authorization).toBe('Bearer stored-token');

      // 恢复原始实例
      AuthService['instance'] = instance;
    });
  });

  describe('登录', () => {
    it('应该正确处理登录请求', async () => {
      (http.post as jest.Mock).mockResolvedValueOnce({ data: mockAuthResponse });

      await authService.login({
        username: 'test',
        password: 'password',
      });

      expect(http.post).toHaveBeenCalledWith('/auth/login', {
        username: 'test',
        password: 'password',
      });
      expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.TOKEN, mockAuthResponse.token);
      expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.USER, mockAuthResponse.user);
      expect(authService.getCurrentUser()).toEqual(mockUser);
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('应该在记住登录时保存刷新令牌', async () => {
      (http.post as jest.Mock).mockResolvedValueOnce({ data: mockAuthResponse });

      await authService.login({
        username: 'test',
        password: 'password',
        remember: true,
      });

      expect(storage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.REFRESH_TOKEN,
        mockAuthResponse.refreshToken,
      );
    });

    it('应该处理登录错误', async () => {
      const error = new Error('Login failed');
      (http.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        authService.login({
          username: 'test',
          password: 'wrong',
        }),
      ).rejects.toThrow(error);

      expect(authService.getCurrentUser()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('注册', () => {
    it('应该正确处理注册请求', async () => {
      (http.post as jest.Mock).mockResolvedValueOnce({ data: mockAuthResponse });

      await authService.register({
        username: 'test',
        password: 'password',
        email: 'test@example.com',
      });

      expect(http.post).toHaveBeenCalledWith('/auth/register', {
        username: 'test',
        password: 'password',
        email: 'test@example.com',
      });
      expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.TOKEN, mockAuthResponse.token);
      expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.USER, mockAuthResponse.user);
      expect(authService.getCurrentUser()).toEqual(mockUser);
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('退出登录', () => {
    it('应该正确处理退出登录请求', async () => {
      // 先登录
      (http.post as jest.Mock).mockResolvedValueOnce({ data: mockAuthResponse });
      await authService.login({
        username: 'test',
        password: 'password',
      });

      // 清理mock
      (http.post as jest.Mock).mockClear();
      (http.post as jest.Mock).mockResolvedValueOnce({});

      await authService.logout();

      expect(http.post).toHaveBeenCalledWith('/auth/logout');
      expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.TOKEN);
      expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
      expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
      expect(authService.getCurrentUser()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
      expect(http.defaults.headers.common.Authorization).toBeUndefined();
    });

    it('应该处理退出登录错误', async () => {
      // 先登录
      (http.post as jest.Mock).mockResolvedValueOnce({ data: mockAuthResponse });
      await authService.login({
        username: 'test',
        password: 'password',
      });

      // 清理mock
      (http.post as jest.Mock).mockClear();
      const error = new Error('Logout failed');
      (http.post as jest.Mock).mockRejectedValueOnce(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await authService.logout();

      expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', error);
      expect(authService.getCurrentUser()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('Token刷新', () => {
    it('应该自动刷新过期的token', async () => {
      // 先登录
      (http.post as jest.Mock).mockResolvedValueOnce({ data: mockAuthResponse });
      await authService.login({
        username: 'test',
        password: 'password',
        remember: true,
      });

      // 模拟401错误
      const originalRequest = { url: '/test', _retry: false };
      const error = {
        config: originalRequest,
        response: { status: 401 },
      };

      // 模拟刷新token响应
      const newToken = 'new-token';
      (http.post as jest.Mock).mockResolvedValueOnce({
        data: { ...mockAuthResponse, token: newToken },
      });

      // 模拟重试原始请求的响应
      const finalResponse = { data: 'success' };
      (http as jest.Mock).mockResolvedValueOnce(finalResponse);

      // 触发token刷新
      const response = await http.interceptors.response.handlers[0].rejected(error);

      expect(http.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: mockAuthResponse.refreshToken,
      });
      expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.TOKEN, newToken);
      expect(http.defaults.headers.common.Authorization).toBe(`Bearer ${newToken}`);
      expect(response).toEqual(finalResponse);
    });

    it('应该在刷新token失败时清理认证状态', async () => {
      // 先登录
      (http.post as jest.Mock).mockResolvedValueOnce({ data: mockAuthResponse });
      await authService.login({
        username: 'test',
        password: 'password',
        remember: true,
      });

      // 模拟401错误
      const error = {
        config: { url: '/test', _retry: false },
        response: { status: 401 },
      };

      // 模拟刷新token失败
      (http.post as jest.Mock).mockRejectedValueOnce(new Error('Refresh failed'));

      // 触发token刷新
      await expect(http.interceptors.response.handlers[0].rejected(error)).rejects.toThrow(
        'Refresh failed',
      );

      expect(authService.getCurrentUser()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
      expect(http.defaults.headers.common.Authorization).toBeUndefined();
    });
  });
});
