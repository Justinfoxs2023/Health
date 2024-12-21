/**
 * @fileoverview TS 文件 base.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 基础类型定义
declare module 'base-types' {
  // 通用响应类型
  export interface ApiResponse<T = any> {
    code: number;
    data?: T;
    message?: string;
  }

  // 分页参数
  export interface PaginationParams {
    page?: number;
    limit?: number;
  }

  // 用户类型
  export interface User {
    id: string;
    roles: string[];
    permissions?: string[];
  }

  // 错误类型
  export class BaseError extends Error {
    code: string;
    status: number;
  }
}
