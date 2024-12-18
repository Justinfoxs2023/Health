/**
 * @fileoverview TS 文件 metrics.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IMetrics {
  recordMetric(name: string, value: number): void;
  getMetric(name: string): number;
  incrementMetric(name: string): void;
  setMetric(name: string, value: number): void;
}
