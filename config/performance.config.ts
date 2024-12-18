import { AIOptimizationConfig } from '../types/ai';
import { CacheOptions } from '../types/cache';
import { EdgeComputingConfig } from '../types/edge';

export const cacheConfig: CacheOptions = {
  // 多级缓存策略
  local: {
    enabled: true,
    maxSize: 100 * 1024 * 1024, // 100MB
    ttl: 24 * 60 * 60 * 1000, // 24小时
  },
  memory: {
    enabled: true,
    maxItems: 10000,
    ttl: 30 * 60 * 1000, // 30分钟
  },
  redis: {
    enabled: true,
    maxMemory: '2gb',
    evictionPolicy: 'allkeys-lru',
    keyPrefix: 'health:',
  },
};

export const aiOptimizationConfig: AIOptimizationConfig = {
  // AI模型优化
  modelCompression: {
    enabled: true,
    method: 'quantization',
    precision: 'int8',
  },
  batchProcessing: {
    enabled: true,
    maxBatchSize: 32,
    timeout: 100, // ms
  },
  modelCaching: {
    enabled: true,
    strategy: 'lru',
    maxSize: 1024 * 1024 * 1024, // 1GB
  },
};

export const edgeComputingConfig: EdgeComputingConfig = {
  // 边缘计算配置
  enabled: true,
  dataProcessing: {
    localProcessing: ['imagePreprocessing', 'dataValidation', 'basicAnalytics'],
    cloudProcessing: ['deepLearning', 'complexAnalytics'],
  },
  sync: {
    strategy: 'incremental',
    interval: 5 * 60 * 1000, // 5分钟
    retryAttempts: 3,
  },
  storage: {
    maxLocalSize: 500 * 1024 * 1024, // 500MB
    priorityData: ['healthMetrics', 'activityLogs'],
  },
};
