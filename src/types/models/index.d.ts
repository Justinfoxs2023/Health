/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'models' {
  export interface BaseModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
