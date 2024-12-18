/**
 * @fileoverview TS 文件 winston.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'winston' {
  export interface Logger {
    infomessage: string, meta: any: void;
    errormessage: string, meta: any: void;
    debugmessage: string, meta: any: void;
  }

  export function createLogger(options: any): Logger;
  export const format: any;
  export const transports: any;
}
