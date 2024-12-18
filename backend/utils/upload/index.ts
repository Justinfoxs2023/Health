/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export * from './upload';
export * from './types';

// 确保重新导出 UploadedFile 类型
export type { IUploadedFile } from './types';
