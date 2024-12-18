import { useState, useEffect, useCallback } from 'react';

import { IUser } from '../types';
import { authService, ILoginParams, IRegisterParams } from '../services/auth';

/** 认证Hook */
export function useAuth(): {
  user: any;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (
    params: import('D:/Health/packages/shared/src/services/auth/index').ILoginParams,
  ) => Promise<void>;
  register: (
    params: import('D:/Health/packages/shared/src/services/auth/index').IRegisterParams,
  ) => Promise<void>;
  logout: () => Promise<void>;
} {
  const [user, setUser] = useState<IUser | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 监听认证状态变化
  useEffect(() => {
    const handleAuthChange = (e: CustomEvent) => {
      setUser(e.detail.user);
    };

    window.addEventListener('authChange', handleAuthChange as EventListener);
    return () => {
      window.removeEventListener('authChange', handleAuthChange as EventListener);
    };
  }, []);

  /** 登录 */
  const login = useCallback(async (params: ILoginParams) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(params);
      setUser(authService.getCurrentUser());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('登录失败'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 注册 */
  const register = useCallback(async (params: IRegisterParams) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(params);
      setUser(authService.getCurrentUser());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('注册失败'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 退出登录 */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('退出登录失败'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: authService.isAuthenticated(),
    login,
    register,
    logout,
  };
}
