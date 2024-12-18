/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  setex(key: string, seconds: number, value: string): Promise<void>;
  del(key: string | string[]): Promise<void>;
  exists(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  multi(): IRedisMulti;
}

export interface IRedisMulti {
  set(key: string, value: string): this;
  exec(): Promise<any[]>;
}
