/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'protection' {
  export interface ProtectionConfig {
    encryption: {
      enabled: boolean;
      algorithm: string;
    };
    backup: {
      enabled: boolean;
      interval: number;
    };
  }
}
