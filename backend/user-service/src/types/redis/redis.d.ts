import { Redis as IORedis } from 'ioredis';

export interface IRedis extends IORedis {
  lpush(key: string, value: string): Promise<number>;
  ltrim(key: string, start: number, stop: number): Promise<'OK'>;
  sadd(key: string, ...members: string[]): Promise<number>;
  srem(key: string, ...members: string[]): Promise<number>;
  smembers(key: string): Promise<string[]>;
  sismember(key: string, member: string): Promise<number>;
  remove(key: string): Promise<void>;
}

// 扩展 RedisClient 类型
export interface IRedisClient extends IRedis {
  /** options 的描述 */
  options: any;
  /** status 的描述 */
  status: string;
  /** stream 的描述 */
  stream: any;
  /** isCluster 的描述 */
  isCluster: boolean;
}
