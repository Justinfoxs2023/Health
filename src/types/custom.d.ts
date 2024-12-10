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
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    MONGODB_URI: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    JWT_SECRET: string;
    // 添加其他环境变量
  }
}

// 扩展Express请求对象
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      roles: string[];
    };
  }
}

declare module 'analytics' {
  export interface Analytics {
    // 定义类型
  }
}

declare module 'community' {
  export interface Community {
    // 定义类型
  }
}

declare module 'improvement' {
  export interface Improvement {
    // 定义类型
  }
}

declare module 'membership' {
  export interface Membership {
    // 定义类型
  }
}

declare module 'models' {
  export interface Models {
    // 定义类型
  }
}

declare module 'protection' {
  export interface Protection {
    // 定义类型
  }
}

declare module 'provider' {
  export interface Provider {
    // 定义类型
  }
}

declare module 'supervision' {
  export interface Supervision {
    // 定义类型
  }
} 