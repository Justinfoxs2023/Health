import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { storage } from '../utils';

export class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors() {
    // 请求拦截器
    this.api.interceptors.request.use(
      async config => {
        const token = await storage.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      response => response.data,
      error => {
        if (error.response?.status === 401) {
          // 处理token过期
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      },
    );
  }

  private handleUnauthorized() {
    storage.remove('token');
    // 跳转到登录页
    // navigation.navigate('Login');
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete(url, config);
  }
}
