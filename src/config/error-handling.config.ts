/**
 * @fileoverview TS 文件 error-handling.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const ERROR_HANDLERS = {
  HEALTH_PROFILE_ERROR: {
    code: 'HEALTH_001',
    message: '健康档案处理错误',
    severity: 'high',
    retry: true,
  },
  TRADING_ERROR: {
    code: 'TRADE_001',
    message: '交易处理错误',
    severity: 'high',
    retry: false,
  },
  // ... 其他错误定义
};

export const MONITORING_CONFIG = {
  healthCheck: {
    interval: 60000,
    timeout: 5000,
    endpoints: ['health', 'trading', 'ai'],
  },
  performance: {
    sampling: 0.1,
    metrics: ['latency', 'error_rate', 'throughput'],
  },
};
