/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 导出所有类型
export * from './base';
export * from './express';
export * from './design';
export * from './services';
export * from './models';
export * from './utils';

// 全局类型声明
declare global {
  // 基础类型
  type Dict = Record<string, any>;

  // 错误类型
  interface AppError extends Error {
    code: string;
    status: number;
    data?: any;
  }

  // API响应类型
  interface ApiResponse<T = any> {
    code: number;
    message?: string;
    data?: T;
  }

  // 服务接口类型
  interface BaseService {
    logger: Logger;
    init(): Promise<void>;
    validate(data: any): Promise<boolean>;
    handleError(error: Error): void;
  }
}
