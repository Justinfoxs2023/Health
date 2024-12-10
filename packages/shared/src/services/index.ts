// 导出核心服务
export * from './api';
export * from './auth';
export * from './storage';
export * from './notification';
export * from './healthData';
export * from './analytics';
export * from './logger';
export * from './http';
export * from './error';
export * from './theme';
export * from './i18n';
export * from './statistics';

// API服务基类
export class BaseApiService {
  protected baseURL: string;
  protected timeout: number;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
    this.timeout = 10000;
  }

  protected handleError(error: any) {
    console.error('API Error:', error);
    throw error;
  }

  protected handleResponse(response: any) {
    if (!response.success) {
      throw new Error(response.message || '请求失败');
    }
    return response.data;
  }
}

// 健康数据服务
export class HealthDataService extends BaseApiService {
  async getHealthData(userId: string, type: string) {
    try {
      const response = await fetch(`${this.baseURL}/health-data/${userId}?type=${type}`);
      const data = await response.json();
      return this.handleResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async saveHealthData(data: any) {
    try {
      const response = await fetch(`${this.baseURL}/health-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return this.handleResponse(result);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// 认证服务
export class AuthService extends BaseApiService {
  async login(username: string, password: string) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      return this.handleResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout() {
    try {
      const response = await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
      });
      const data = await response.json();
      return this.handleResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// 存储服务
export class StorageService {
  setItem(key: string, value: any) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Storage Error:', error);
    }
  }

  getItem(key: string) {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error('Storage Error:', error);
      return null;
    }
  }

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage Error:', error);
    }
  }

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage Error:', error);
    }
  }
} 