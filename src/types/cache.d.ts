/**
 * @fileoverview TS 文件 cache.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 缓存配置类型定义
export interface ICacheConfig {
  /** local 的描述 */
  local: {
    type: caffeine;
    maximumSize: number;
    expireAfterWrite: number;
    milliseconds;
    expireAfterAccess: number;
    milliseconds;
  };

  // 分布式缓存配置
  /** distributed 的描述 */
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
  /** strategy 的描述 */
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
