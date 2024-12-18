/**
 * @fileoverview TS 文件 interfaces.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ICacheConfig {
  /** strategy 的描述 */
    strategy: lru  lfu  ttl;
  maxSize: number;
  maxAge: number;
}

export interface ICachePattern {
  /** pattern 的描述 */
    pattern: string;
  /** strategy 的描述 */
    strategy: lru  lfu  ttl;
  maxSize: number;
  maxAge: number;
}

export interface ICacheStats {
  /** hits 的描述 */
    hits: number;
  /** misses 的描述 */
    misses: number;
  /** hitRate 的描述 */
    hitRate: number;
  /** size 的描述 */
    size: number;
  /** memory 的描述 */
    memory: number;
  /** evictions 的描述 */
    evictions: number;
}

export interface ICacheEntry {
  /** key 的描述 */
    key: string;
  /** value 的描述 */
    value: any;
  /** size 的描述 */
    size: number;
  /** hits 的描述 */
    hits: number;
  /** lastAccessed 的描述 */
    lastAccessed: Date;
  /** createdAt 的描述 */
    createdAt: Date;
  /** expiresAt 的描述 */
    expiresAt: Date;
}

export interface ICacheOptimizationResult {
  /** before 的描述 */
    before: ICacheStats;
  /** after 的描述 */
    after: ICacheStats;
  /** recommendations 的描述 */
    recommendations: Array{
    type: resize  evict  preload  ttl;
    description: string;
    impact: {
      hitRate: number;
      memory: number;
    };
  }>;
}

export interface ICachePreloadConfig {
  /** patterns 的描述 */
    patterns: string;
  /** strategy 的描述 */
    strategy: all  popular  recent;
  limit: number;
  concurrency: number;
}

export interface ICacheEvictionConfig {
  /** strategy 的描述 */
    strategy: lru  lfu  ttl  random;
  threshold: number;
  minAge: number;
}

export interface ICacheCompressionConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** algorithm 的描述 */
    algorithm: gzip  lz4  snappy;
  threshold: number;
  level: number;
}

export interface ICacheClusterConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** nodes 的描述 */
    nodes: Array{
    host: string;
    port: number;
    weight: number;
  }>;
  replication: {
    enabled: boolean;
    factor: number;
  };
}

export interface ICacheMonitoringConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** interval 的描述 */
    interval: number;
  /** metrics 的描述 */
    metrics: Arrayhits  misses  memory  evictions;
  alerts: Array{
    metric: string;
    threshold: number;
    period: number;
    action: string;
  }>;
}
