/**
 * @fileoverview TS 文件 config.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'config-types' {
  export interface Config {
    redis: {
      host: string;
      port: number;
      password?: string;
      db: number;
    };
    jwt: {
      secret: string;
      refreshSecret: string;
      accessTokenExpiry: number;
      refreshTokenExpiry: number;
    };
    security: {
      maxLoginAttempts: number;
      loginAttemptsTTL: number;
      accountLockDuration: number;
      maxIPRequests: number;
      ipLimitTTL: number;
    };
    cache: {
      userTTL: number;
    };
  }
}
