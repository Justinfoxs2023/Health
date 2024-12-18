/**
 * @fileoverview TS 文件 skeleton.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 骨架屏配置
export interface ISkeletonConfig {
  // 基础配置
  /** animation 的描述 */
  animation: 'pulse' | 'wave' | 'none';
  /** duration 的描述 */
  duration: number;
  /** delay 的描述 */
  delay: number;
  /** repeat 的描述 */
  repeat: boolean;

  // 样式配置
  /** style 的描述 */
  style: {
    backgroundColor: string;
    highlightColor: string;
    borderRadius: number;
    width: string | number;
    height: string | number;
  };

  // 布局配置
  /** layout 的描述 */
  layout: {
    rows: number;
    columns: number;
    gap: number;
    aspectRatio?: number;
  };
}

// 预加载配置
export interface IPreloadConfig {
  // 预加载策略
  /** strategy 的描述 */
  strategy: 'eager' | 'lazy' | 'progressive';

  // 优先级配置
  /** priority 的描述 */
  priority: {
    critical: string[]; // 关键资源
    high: string[]; // 高优先级
    medium: string[]; // 中优先级
    low: string[]; // 低优先级
  };

  // 缓存配置
  /** cache 的描述 */
  cache: {
    enabled: boolean;
    maxAge: number;
    maxSize: number;
    strategy: 'LRU' | 'LFU' | 'FIFO';
  };

  // 网络配置
  /** network 的描述 */
  network: {
    timeout: number;
    retries: number;
    concurrency: number;
    throttle: number;
  };
}
