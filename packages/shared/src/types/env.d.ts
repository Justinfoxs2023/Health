/**
 * @fileoverview TS 文件 env.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    APP_NAME: string;
    APP_ENV: string;
    APP_DEBUG: string;
    APP_URL: string;
    APP_PORT: string;
    SERVICE_NAME: string;
    SERVICE_VERSION: string;

    // 数据库配置
    DB_TYPE: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PASS: string;

    // Redis配置
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    REDIS_DB: string;

    // 其他配置...
    [key: string]: string | undefined;
  }
}

export {};
