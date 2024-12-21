/**
 * @fileoverview TS 文件 redis.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'redis' {
  export interface RedisClient {
    getkey: string: Promisestring  null;
    setexkey: string, seconds: number, value: string: Promisevoid;
    quit: Promisevoid;
  }

  export interface IRedisConfig {
    /** getkey 的描述 */
      getkey: string: Promisestring  null;
    setexkey: string, seconds: number, value: string: Promisevoid;
    quit: Promisevoid;
  }
}
