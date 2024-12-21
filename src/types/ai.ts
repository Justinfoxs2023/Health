/**
 * @fileoverview TS 文件 ai.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IAIOptimizationConfig {
  /** modelCompression 的描述 */
    modelCompression: {
    enabled: boolean;
    method: quantization  pruning  distillation;
    precision: int8  float16  float32;
  };
  batchProcessing: {
    enabled: boolean;
    maxBatchSize: number;
    timeout: number;
  };
  modelCaching: {
    enabled: boolean;
    strategy: 'lru' | 'fifo' | 'lfu';
    maxSize: number;
  };
}
