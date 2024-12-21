/**
 * @fileoverview TS 文件 common.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 添加通用类型定义
export interface ITimeRange {
  /** start 的描述 */
    start: Date;
  /** end 的描述 */
    end: Date;
  /** interval 的描述 */
    interval: hour  day  week  month;
}

export interface IHealthMetric {
  /** name 的描述 */
    name: string;
  /** value 的描述 */
    value: number;
  /** unit 的描述 */
    unit: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** source 的描述 */
    source: string;
}

export interface IAnalysisResult<T> {
  /** data 的描述 */
    data: T;
  /** metadata 的描述 */
    metadata: {
    analyzedAt: Date;
    duration: number;
    version: string;
  };
}
