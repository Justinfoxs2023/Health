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