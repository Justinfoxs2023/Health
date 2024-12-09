// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  data?: T;
  message?: string;
}

// API错误类型
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// API请求配置类型
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

// API请求参数类型
export interface RequestParams {
  [key: string]: string | number | boolean | undefined;
}

// API分页参数类型
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// API分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API认证类型
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
} 