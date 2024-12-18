/**
 * @fileoverview TS 文件 monitoring.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const monitoringConfig = {
  slowQueryThreshold: 1000, // 慢查询阈值(ms)
  poolSizeWarning: 80, // 连接池使用率警告阈值(%)
  tableSizeWarning: 1024 * 1024 * 100, // 表大小警告阈值(100MB)
  checkInterval: 5 * 60 * 1000, // 检查间隔(5分钟)
  alerts: {
    email: ['admin@example.com'],
    slack: 'webhook_url',
  },
};
