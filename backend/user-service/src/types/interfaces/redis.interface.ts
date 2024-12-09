export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  setex(key: string, seconds: number, value: string): Promise<void>;
  del(key: string): Promise<void>;
  hset(key: string, field: string, value: string | object): Promise<void>;
  hget(key: string, field: string): Promise<string | null>;
  lpush(key: string, value: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
  ping(): Promise<string>;
  exists(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  incr(key: string): Promise<number>;
  setnx(key: string, value: string): Promise<number>;
  multi(): RedisMulti;
}

export interface RedisMulti {
  exec(): Promise<any[]>;
  set(key: string, value: string): this;
  setex(key: string, seconds: number, value: string): this;
  del(key: string): this;
  hset(key: string, field: string, value: string | object): this;
} 