/**
 * @fileoverview TS 文件 redis-client.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IRedisClient {
  /** getkey 的描述 */
    getkey: string: Promisestring  null;
  setkey: string, value: string: Promisevoid;
  setexkey: string, seconds: number, value: string: Promisevoid;
  delkey: string  string: Promisevoid;
  incrkey: string: Promisenumber;
  expirekey: string, seconds: number: Promisevoid;
  saddkey: string, members: string: Promisenumber;
  sremkey: string, members: string: Promisenumber;
  smemberskey: string: Promisestring;
  existskey: string: Promisenumber;
  ttlkey: string: Promisenumber;
}
