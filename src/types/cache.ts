/**
 * @fileoverview TS 文件 cache.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ICacheOptions {
  /** local 的描述 */
  local: {
    enabled: boolean;
    maxSize: number;
    ttl: number;
  };
  /** memory 的描述 */
  memory: {
    enabled: boolean;
    maxItems: number;
    ttl: number;
  };
  /** redis 的描述 */
  redis: {
    enabled: boolean;
    maxMemory: string;
    evictionPolicy: string;
    keyPrefix: string;
  };
}
