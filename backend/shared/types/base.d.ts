// 基础类型定义
export interface BaseTypes {
  // Express相关类型
  Request: Express.Request;
  Response: Express.Response;
  NextFunction: () => void;
  
  // 服务相关类型
  Service: {
    init(): Promise<void>;
    validate(data: any): Promise<boolean>;
    handleError(error: Error): void;
  };
  
  // Redis相关类型
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
  Logger: {
    info(message: string, ...args: any[]): void;
    error(message: string, error?: Error): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
  };
} 