/**
 * @fileoverview TS 文件 monitoring.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IPerformanceConfig {
  /** metrics 的描述 */
  metrics: {
    enabled: boolean;
    interval: number;
    retention: number;
  };
  /** alerts 的描述 */
  alerts: {
    enabled: boolean;
    thresholds: {
      cpu: number;
      memory: number;
      latency: number;
      dbSlowThreshold: number;
      cacheHitRateThreshold: number;
    };
  };
  /** logging 的描述 */
  logging: {
    level: string;
    format: string;
  };
}
