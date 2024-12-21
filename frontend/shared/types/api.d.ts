/**
 * @fileoverview TS 文件 api.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// API响应类型
export interface IApiResponse<T = any> {
  /** code 的描述 */
  code: number;
  /** data 的描述 */
  data?: T;
  /** message 的描述 */
  message?: string;
}

// API错误类型
export interface IApiError {
  /** code 的描述 */
  code: number;
  /** message 的描述 */
  message: string;
  /** details 的描述 */
  details?: any;
}

// API请求配置类型
export interface IApiConfig {
  /** baseURL 的描述 */
  baseURL: string;
  /** timeout 的描述 */
  timeout: number;
  /** headers 的描述 */
  headers?: Record<string, string>;
}

// API请求参数类型
export interface IRequestParams {
  [key: string]: string | number | boolean | undefined;
}

// API分页参数类型
export interface IPaginationParams {
  /** page 的描述 */
  page?: number;
  /** limit 的描述 */
  limit?: number;
  /** sort 的描述 */
  sort?: string;
  /** order 的描述 */
  order?: 'asc' | 'desc';
}

// API分页响应类型
export interface IPaginatedResponse<T> {
  /** items 的描述 */
  items: T[];
  /** total 的描述 */
  total: number;
  /** page 的描述 */
  page: number;
  /** limit 的描述 */
  limit: number;
  /** totalPages 的描述 */
  totalPages: number;
}

// API认证类型
export interface IAuthTokens {
  /** accessToken 的描述 */
  accessToken: string;
  /** refreshToken 的描述 */
  refreshToken: string;
  /** expiresIn 的描述 */
  expiresIn: number;
}
