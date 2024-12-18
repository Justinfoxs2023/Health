/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 基础响应类型
export interface IBaseResponse<T = any> {
  /** code 的描述 */
  code: number;
  /** data 的描述 */
  data: T;
  /** message 的描述 */
  message: string;
  /** timestamp 的描述 */
  timestamp: Date;
}

// 分页请求参数
export interface IPaginationParams {
  /** page 的描述 */
  page: number;
  /** pageSize 的描述 */
  pageSize: number;
  /** sortBy 的描述 */
  sortBy?: string;
  /** sortOrder 的描述 */
  sortOrder?: 'asc' | 'desc';
  /** filters 的描述 */
  filters?: Record<string, any>;
}

// 分页响应数据
export interface IPaginatedData<T> {
  /** items 的描述 */
  items: T[];
  /** total 的描述 */
  total: number;
  /** page 的描述 */
  page: number;
  /** pageSize 的描述 */
  pageSize: number;
  /** totalPages 的描述 */
  totalPages: number;
}

// 基础配置类型
export interface IBaseConfig {
  /** env 的描述 */
  env: 'development' | 'production' | 'test';
  /** version 的描述 */
  version: string;
  /** apiVersion 的描述 */
  apiVersion: string;
  /** features 的描述 */
  features: Record<string, boolean>;
}

// 错误类型
export interface IAppError extends Error {
  /** code 的描述 */
  code: string;
  /** status 的描述 */
  status: number;
  /** details 的描述 */
  details?: any;
  /** timestamp 的描述 */
  timestamp: Date;
}
