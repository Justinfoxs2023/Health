export interface AIOptimizationConfig {
  /** 模型类型 */
  modelType: 'transformer' | 'cnn' | 'rnn';
  /** 批处理大小 */
  batchSize: number;
  /** 学习率 */
  learningRate: number;
  /** 优化器配置 */
  optimizer: {
    /** 优化器类型 */
    type: 'adam' | 'sgd' | 'rmsprop';
    /** 动量参数 */
    momentum?: number;
    /** 衰减率 */
    decay?: number;
  };
  /** 训练配置 */
  training: {
    /** 训练轮数 */
    epochs: number;
    /** 验证分割比例 */
    validationSplit: number;
    /** 早停参数 */
    earlyStop?: {
      /** 监控指标 */
      monitor: string;
      /** 耐心值 */
      patience: number;
    };
  };
  /** 硬件加速配置 */
  hardware: {
    /** 是否使用GPU */
    useGPU: boolean;
    /** GPU内存限制（MB） */
    gpuMemoryLimit?: number;
  };
} 