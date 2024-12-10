// 缓存配置类型定义
export interface CacheConfig {
  // 本地缓存配置
  local: {
    type: 'caffeine';
    maximumSize: number;
    expireAfterWrite: number; // milliseconds
    expireAfterAccess: number; // milliseconds
  };

  // 分布式缓存配置
  distributed: {
    type: 'redis';
    cluster: boolean;
    nodes: Array<{
      host: string;
      port: number;
    }>;
    maxMemory: string;
    evictionPolicy: 'allkeys-lru' | 'volatile-lru' | 'allkeys-random';
  };

  // 缓存策略配置
  strategy: {
    reading: {
      pattern: 'read-through' | 'cache-aside';
      sync: boolean;
      timeout: number;
    };
    writing: {
      pattern: 'write-through' | 'write-behind';
      batchSize: number;
      delay: number; // milliseconds
    };
  };
} 