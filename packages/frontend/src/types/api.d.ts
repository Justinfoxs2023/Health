/**
 * @fileoverview TS 文件 api.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '../utils/api' {
  import { AxiosInstance } from 'axios';

  interface ApiService {
    get<T = any>(url: string, config?: any): Promise<T>;
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    delete<T = any>(url: string, config?: any): Promise<T>;
  }

  export const api: AxiosInstance & ApiService;
}
