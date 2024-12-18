/**
 * @fileoverview TS 文件 custom.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// Redis类型定义
declare class Redis {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  setex(key: string, seconds: number, value: string): Promise<void>;
  del(key: string): Promise<void>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
  sadd(key: string, ...members: string[]): Promise<number>;
  // 添加其他需要的Redis方法
}

// 环境变量类型定义
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: development  production  test;
    PORT: string;
    MONGODB_URI: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    JWT_SECRET: string;
     
  }
}

// 扩展Express请求对象
declare namespace Express {
  interface Request {
    user: {
      id: string;
      roles: string;
    };
  }
}

declare module 'analytics' {
  export interface Analytics {
     
  }
}

declare module 'community' {
  export interface Community {
     
  }
}

declare module 'improvement' {
  export interface Improvement {
     
  }
}

declare module 'membership' {
  export interface Membership {
     
  }
}

declare module 'models' {
  export interface Models {
     
  }
}

declare module 'protection' {
  export interface Protection {
     
  }
}

declare module 'provider' {
  export interface Provider {
     
  }
}

declare module 'supervision' {
  export interface Supervision {
     
  }
}

declare module 'react-chartjs-2';
declare module '@mui/material/*';
declare module 'chart.js';
