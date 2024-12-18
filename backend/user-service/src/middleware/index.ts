/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export * from './auth.middleware';
export * from './role.middleware';
export * from './permission.middleware';
export * from './validation.middleware';
export * from './rate-limit.middleware';
export * from './error.middleware';
export * from './upload.middleware';
export * from './file-process.middleware';
export * from './logger.middleware';
export * from './monitor.middleware';

// 导出中间件类型
export type AuthMiddlewareType = import('./auth.middleware').AuthMiddleware;
export type RoleMiddlewareType = import('./role.middleware').RoleMiddleware;
export type ValidationMiddlewareType = import('./validation.middleware').ValidationMiddleware;

// 导出中间件实例
export const auth = new (require('./auth.middleware').AuthMiddleware)();
export const role = new (require('./role.middleware').RoleMiddleware)();
export const rateLimit = new (require('./rate-limit.middleware').RateLimitMiddleware)();
export const validation = new (require('./validation.middleware').ValidationMiddleware)();
export const upload = new (require('./upload.middleware').UploadMiddleware)();
