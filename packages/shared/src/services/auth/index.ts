import { IUser } from '../../types';
import { STORAGE_KEYS } from '../../constants';
import { http } from '../http';
import { storage } from '../storage';

/** 登录参数 */
export interface ILoginParams {
  /** username 的描述 */
  username: string;
  /** password 的描述 */
  password: string;
  /** remember 的描述 */
  remember?: boolean;
}

/** 注册参数 */
export interface IRegisterParams {
  /** username 的描述 */
  username: string;
  /** password 的描述 */
  password: string;
  /** email 的描述 */
  email: string;
  /** phone 的描述 */
  phone?: string;
}

/** 认证响应 */
export interface IAuthResponse {
  /** user 的描述 */
  user: IUser;
  /** token 的描述 */
  token: string;
  /** refreshToken 的描述 */
  refreshToken: string;
}

/** 认证服务 */
class AuthService {
  private static instance: AuthService;
  private currentUser: IUser | null = null;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  private constructor() {
    // 从存储中恢复认证状态
    this.token = storage.getItem(STORAGE_KEYS.TOKEN);
    this.refreshToken = storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    this.currentUser = storage.getItem(STORAGE_KEYS.USER);

    // 如果有token，设置HTTP请求头
    if (this.token) {
      this.setAuthHeader(this.token);
    }

    // 添加响应拦截器处理token过期
    http.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // 如果是401错误且不是刷新token的请求
        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshAccessToken();
          }

          try {
            await this.refreshPromise;
            originalRequest._retry = true;
            return http(originalRequest);
          } finally {
            this.refreshPromise = null;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  /** 获取单例 */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /** 获取当前用户 */
  public getCurrentUser(): IUser | null {
    return this.currentUser;
  }

  /** 是否已认证 */
  public isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  /** 登录 */
  public async login(params: ILoginParams): Promise<void> {
    const { data } = await http.post<IAuthResponse>('/auth/login', params);
    this.handleAuthSuccess(data);

    // 如果记住登录，保存刷新令牌
    if (params.remember) {
      storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    }
  }

  /** 注册 */
  public async register(params: IRegisterParams): Promise<void> {
    const { data } = await http.post<IAuthResponse>('/auth/register', params);
    this.handleAuthSuccess(data);
  }

  /** 退出登录 */
  public async logout(): Promise<void> {
    if (this.token) {
      try {
        await http.post('/auth/logout');
      } catch (error) {
        console.error('Error in index.ts:', 'Logout failed:', error);
      }
    }

    this.clearAuth();
  }

  /** 刷新访问令牌 */
  private async refreshAccessToken(): Promise<void> {
    try {
      const { data } = await http.post<IAuthResponse>('/auth/refresh', {
        refreshToken: this.refreshToken,
      });

      this.token = data.token;
      this.setAuthHeader(data.token);
      storage.setItem(STORAGE_KEYS.TOKEN, data.token);
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  /** 处理认证成功 */
  private handleAuthSuccess(response: IAuthResponse): void {
    const { user, token, refreshToken } = response;

    this.currentUser = user;
    this.token = token;
    this.refreshToken = refreshToken;

    // 保存认证状态
    storage.setItem(STORAGE_KEYS.USER, user);
    storage.setItem(STORAGE_KEYS.TOKEN, token);

    // 设置请求头
    this.setAuthHeader(token);
  }

  /** 清理认证状态 */
  private clearAuth(): void {
    this.currentUser = null;
    this.token = null;
    this.refreshToken = null;

    // 清理存储
    storage.removeItem(STORAGE_KEYS.USER);
    storage.removeItem(STORAGE_KEYS.TOKEN);
    storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    // 清理请求头
    this.setAuthHeader(null);
  }

  /** 设置认证请求头 */
  private setAuthHeader(token: string | null): void {
    if (token) {
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete http.defaults.headers.common.Authorization;
    }
  }
}

/** 认证服务实例 */
export const authService = AuthService.getInstance();
