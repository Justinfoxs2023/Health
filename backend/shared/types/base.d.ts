/**
 * @fileoverview TS 文件 base.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 基础类型定义
export interface IBaseTypes {
  // Express相关类型
  /** Request 的描述 */
  Request: Express.Request;
  /** Response 的描述 */
  Response: Express.Response;
  /** NextFunction 的描述 */
  NextFunction: () => void;

  // 服务相关类型
  /** Service 的描述 */
  Service: {
    init(): Promise<void>;
    validate(data: any): Promise<boolean>;
    handleError(error: Error): void;
  };

  // Redis相关类型
  /** Redis 的描述 */
  Redis: {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<'OK'>;
    setex(key: string, seconds: number, value: string): Promise<'OK'>;
    del(key: string | string[]): Promise<number>;
    lpush(key: string, value: string): Promise<number>;
    ltrim(key: string, start: number, stop: number): Promise<'OK'>;
    sadd(key: string, ...members: string[]): Promise<number>;
    srem(key: string, ...members: string[]): Promise<number>;
    smembers(key: string): Promise<string[]>;
    sismember(key: string, member: string): Promise<number>;
  };

  // 日志相关类型
  /** Logger 的描述 */
  Logger: {
    info(message: string, ...args: any[]): void;
    error(message: string, error?: Error): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
  };
}
