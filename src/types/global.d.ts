/**
 * @fileoverview TS 文件 global.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/// <reference path="./analytics/index.d.ts" />
/// <reference path="./community/index.d.ts" />
/// <reference path="./improvement/index.d.ts" />
/// <reference path="./membership/index.d.ts" />
/// <reference path="./models/index.d.ts" />
/// <reference path="./protection/index.d.ts" />
/// <reference path="./provider/index.d.ts" />
/// <reference path="./supervision/index.d.ts" />

declare module '@types/analytics' {
  export * from 'analytics';
}

declare module '@types/community' {
  export * from 'community';
}

declare module '@types/improvement' {
  export * from 'improvement';
}

declare module '@types/membership' {
  export * from 'membership';
}

declare module '@types/models' {
  export * from 'models';
}

declare module '@types/protection' {
  export * from 'protection';
}

declare module '@types/provider' {
  export * from 'provider';
}

declare module '@types/supervision' {
  export * from 'supervision';
}

// 基础模块声明
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// 资源文件声明
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: { [key: string]: any };
  export default content;
}

// 环境变量声明
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: development  production  test;
    PORT: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;

    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    REDIS_CLUSTER_ENABLED: string;
    REDIS_NODES: string;

    CONSUL_HOST: string;
    CONSUL_PORT: string;

    GRPC_HOST: string;
    GRPC_PORT: string;

    CACHE_LOCAL_MAX_SIZE: string;
    CACHE_LOCAL_TTL: string;
    CACHE_DISTRIBUTED_TTL: string;
    CACHE_WRITE_PATTERN: string;

    SERVICE_NAME: string;
    SERVICE_VERSION: string;
  }
}
