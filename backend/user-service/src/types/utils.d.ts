/**
 * @fileoverview TS 文件 utils.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '../utils/*' {
  // 日志工具
  export interface Logger {
    info(message: string, ...args: any[]): void;
    error(message: string, error?: any): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
  }

  // Redis工具
  export interface Redis {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    setex(key: string, seconds: number, value: string): Promise<void>;
    del(key: string | string[]): Promise<void>;
    incr(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<void>;
  }

  // 验证工具
  export interface Validators {
    validateLogin(data: any): ValidationResult;
    validateOAuth(data: any): ValidationResult;
    validateUserUpdate(data: any): ValidationResult;
    validateHealthRecord(data: any): ValidationResult;
  }

  // 加密工具
  export interface Crypto {
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    generateToken(length?: number): string;
  }
}
