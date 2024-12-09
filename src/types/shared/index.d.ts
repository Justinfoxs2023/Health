// 基础响应类型
export interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
  timestamp: Date;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// 分页响应数据
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 基础配置类型
export interface BaseConfig {
  env: 'development' | 'production' | 'test';
  version: string;
  apiVersion: string;
  features: Record<string, boolean>;
}

// 错误类型
export interface AppError extends Error {
  code: string;
  status: number;
  details?: any;
  timestamp: Date;
} 