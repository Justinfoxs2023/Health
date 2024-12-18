/**
 * @fileoverview TS 文件 edge.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IEdgeComputingConfig {
  /** enabled 的描述 */
  enabled: boolean;
  /** dataProcessing 的描述 */
  dataProcessing: {
    localProcessing: string[];
    cloudProcessing: string[];
  };
  /** sync 的描述 */
  sync: {
    strategy: 'incremental' | 'full';
    interval: number;
    retryAttempts: number;
  };
  /** storage 的描述 */
  storage: {
    maxLocalSize: number;
    priorityData: string[];
  };
}
