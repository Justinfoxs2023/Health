export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  setex(key: string, seconds: number, value: string): Promise<void>;
  del(key: string | string[]): Promise<void>;
  exists(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  multi(): RedisMulti;
}

export interface RedisMulti {
  set(key: string, value: string): this;
  exec(): Promise<any[]>;
} 