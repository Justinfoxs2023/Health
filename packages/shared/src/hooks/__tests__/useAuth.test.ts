import { renderHook, act } from '@testing-library/react-hooks';
import { authService } from '../../services/auth';
import { useAuth } from '../useAuth';

jest.mock('../../services/auth', () => ({
  authService: {
    getCurrentUser: jest.fn(),
    isAuthenticated: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn()
  }
}));

describe('useAuth', () => {
  const mockUser = {
    id: '1',
    username: 'test',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authService.getCurrentUser as jest.Mock).mockReturnValue(null);
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
  });

  it('应该返回初始状态', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('应该从authService加载初始用户', () => {
    (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  describe('登录', () => {
    it('应该成功处理登录', async () => {
      (authService.login as jest.Mock).mockResolvedValueOnce(undefined);
      (authService.getCurrentUser as jest.Mock)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(mockUser);
      (authService.isAuthenticated as jest.Mock)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(false);

      const loginPromise = act(() =>
        result.current.login({
          username: 'test',
          password: 'password'
        })
      );

      expect(result.current.loading).toBe(true);

      await loginPromise;

      expect(authService.login).toHaveBeenCalledWith({
        username: 'test',
        password: 'password'
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('应该处理登录错误', async () => {
      const error = new Error('Login failed');
      (authService.login as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth());

      let thrownError;
      try {
        await act(() =>
          result.current.login({
            username: 'test',
            password: 'wrong'
          })
        );
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBe(error);
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(error);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('注册', () => {
    it('应该成功处理注册', async () => {
      (authService.register as jest.Mock).mockResolvedValueOnce(undefined);
      (authService.getCurrentUser as jest.Mock)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(mockUser);
      (authService.isAuthenticated as jest.Mock)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const { result } = renderHook(() => useAuth());

      await act(() =>
        result.current.register({
          username: 'test',
          password: 'password',
          email: 'test@example.com'
        })
      );

      expect(authService.register).toHaveBeenCalledWith({
        username: 'test',
        password: 'password',
        email: 'test@example.com'
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('应该处理注册错误', async () => {
      const error = new Error('Register failed');
      (authService.register as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth());

      let thrownError;
      try {
        await act(() =>
          result.current.register({
            username: 'test',
            password: 'password',
            email: 'test@example.com'
          })
        );
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBe(error);
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(error);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('退出登录', () => {
    it('应该成功处理退出登录', async () => {
      (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.logout as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth());

      await act(() => result.current.logout());

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('应该处理退出登录错误', async () => {
      const error = new Error('Logout failed');
      (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.logout as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth());

      let thrownError;
      try {
        await act(() => result.current.logout());
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBe(error);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(error);
    });
  });

  it('应该监听认证状态变化', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();

    // 模拟认证状态变化事��
    act(() => {
      window.dispatchEvent(
        new CustomEvent('authChange', {
          detail: { user: mockUser }
        })
      );
    });

    expect(result.current.user).toEqual(mockUser);
  });
}); 