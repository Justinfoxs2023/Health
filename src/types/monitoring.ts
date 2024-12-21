/**
 * @fileoverview TS 文件 monitoring.ts 的功能描述
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
    };
  };
  /** logging 的描述 */
  logging: {
    level: string;
    format: string;
  };
}

export interface IMonitoringData {
  /** timestamp 的描述 */
  timestamp: Date;
  /** metrics 的描述 */
  metrics: {
    cpu: number;
    memory: number;
    latency: number;
  };
  /** alerts 的描述 */
  alerts: IAlert[];
}

export interface IAlert {
  /** id 的描述 */
  id: string;
  /** level 的描述 */
  level: string;
  /** message 的描述 */
  message: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** data 的描述 */
  data: any;
}
