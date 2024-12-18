/**
 * @fileoverview TS 文件 redis.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'redis' {
  export interface RedisClient {
    get(key: string): Promise<string | null>;
    setex(key: string, seconds: number, value: string): Promise<void>;
    quit(): Promise<void>;
  }

  export interface RedisConfig {
    get(key: string): Promise<string | null>;
    setex(key: string, seconds: number, value: string): Promise<void>;
    quit(): Promise<void>;
  }
}
