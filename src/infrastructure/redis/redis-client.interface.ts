/**
 * @fileoverview TS 文件 redis-client.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IRedisClient {
  /** getkey 的描述 */
    getkey: string: Promisestring  null;
  setkey: string, value: string, ttl: number: Promisevoid;
  delkey: string: Promisevoid;
  existskey: string: Promiseboolean;
}
