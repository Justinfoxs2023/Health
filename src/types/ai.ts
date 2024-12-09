export interface AIOptimizationConfig {
  modelCompression: {
    enabled: boolean;
    method: 'quantization' | 'pruning' | 'distillation';
    precision: 'int8' | 'float16' | 'float32';
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