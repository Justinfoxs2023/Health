import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../../constants';

/** 请求配置 */
export interface IRequestConfig extends AxiosRequestConfig {
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 是否显示加载状态 */
  showLoading?: boolean;
  /** 自定义错误处理 */
  handleError?: (error: any) => void;
}

/** 响应数据 */
export interface IResponseData<T = any> {
  /** success 的描述 */
  success: boolean;
  /** data 的描述 */
  data: T;
  /** message 的描述 */
  message?: string;
  /** code 的描述 */
  code: number;
}

/** HTTP客户端类 */
export class HttpClient {
  private instance: AxiosInstance;
  private loadingCount = 0;

  constructor(config: AxiosRequestConfig = {}) {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      ...config,
    });

    this.setupInterceptors();
  }

  /** 设置请求/响应拦截器 */
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: IRequestConfig) => {
        // 添加token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 显示加载状态
        if (config.showLoading !== false) {
          this.loadingCount++;
          this.updateLoadingState();
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 隐藏加载状态
        if ((response.config as IRequestConfig).showLoading !== false) {
          this.loadingCount--;
          this.updateLoadingState();
        }

        const { data } = response;
        if (!data.success) {
          const error = new Error(data.message || '请求失败');
          return Promise.reject(error);
        }

        return data;
      },
      (error: AxiosError) => {
        // 隐藏加载状态
        if ((error.config as IRequestConfig)?.showLoading !== false) {
          this.loadingCount--;
          this.updateLoadingState();
        }

        // 处理错误
        const config = error.config as IRequestConfig;
        if (config?.showError !== false) {
          this.handleError(error, config?.handleError);
        }

        return Promise.reject(error);
      },
    );
  }

  /** 更新加载状态 */
  private updateLoadingState() {
    // 这里可以集成全局loading组件
    if (this.loadingCount > 0) {
      // 显示loading
      document.body.style.cursor = 'wait';
    } else {
      // 隐藏loading
      document.body.style.cursor = 'default';
    }
  }

  /** 处理错误 */
  private handleError(error: AxiosError, customHandler?: (error: any) => void) {
    if (customHandler) {
      customHandler(error);
      return;
    }

    let message = '请求失败';
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          message = '请求参数错误';
          break;
        case 401:
          message = '未授权，请重新登录';
          // 跳转到登录页
          window.location.href = '/login';
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求地址不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `请求失败: ${status}`;
      }
    } else if (error.request) {
      message = '网络异常，请检查网络连接';
    }

    // 这里可以集成全局消息提示组件
    console.error('Error in index.ts:', message);
  }

  /** 发送请求 */
  public async request<T = any>(config: IRequestConfig): Promise<IResponseData<T>> {
    try {
      const response = await this.instance.request<IResponseData<T>>(config);
      return response as IResponseData<T>;
    } catch (error) {
      throw error;
    }
  }

  /** GET请求 */
  public get<T = any>(url: string, config?: IRequestConfig) {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /** POST请求 */
  public post<T = any>(url: string, data?: any, config?: IRequestConfig) {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /** PUT请求 */
  public put<T = any>(url: string, data?: any, config?: IRequestConfig) {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /** DELETE请求 */
  public delete<T = any>(url: string, config?: IRequestConfig) {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

// 导出默认实例
export const http = new HttpClient();
