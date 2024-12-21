/**
 * @fileoverview TS 文件 env.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: development  production  test;
    APP_NAME: string;
    APP_ENV: string;
    APP_DEBUG: string;
    APP_URL: string;
    APP_PORT: string;
    SERVICE_NAME: string;
    SERVICE_VERSION: string;

     
    DB_TYPE: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PASS: string;

     Redis
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    REDIS_DB: string;

     
    key: string: string  undefined;
  }
}

export {};
